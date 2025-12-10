import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import  * as crypto from 'crypto'
import { RedisService } from 'src/redis/redis.service';
import { hashToken } from './hashage/hash.utils';



@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private config: ConfigService,
        private readonly redisService: RedisService
    ){}

    /**
     * Validate user (password and verify email)
     */
    async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null>{
        const user = await this.userService.findUserByEMail(email);

        if (user && user.password) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            const { password: _, ...safeUser } = user;
            return safeUser;
      }
      
    }
        return null  
      }



    /**
     * Login user
     */
    
    async login(user: Omit<User, 'password'>) {
      const payload = { email: user.email, sub: user.id };

       const access_token = this.jwtService.sign(payload, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET' ),
        expiresIn: this.config.get<number>('JWT_ACCESS_EXPIRES_IN',604800),
  });

     //generate refreshtoken
     const refreshtoken = crypto.randomBytes(64).toString('hex');
    
     const hashedRefreshToken = hashToken(refreshtoken)
     
     
    const ttl =  this.config.get('JWT_REFRESH_EXPIRES_IN')
    
    await this.redisService.set(
        `refresh:${hashedRefreshToken}`,
        user.id,
        ttl
     )
     
    return {
         access_token,
          refreshtoken: refreshtoken
    };
  }



    /**
     * Inscription nouvelle utilisateur
     */

    async signup(createuserDto: CreateUserDto): Promise<{user: Omit<User, 'password'>}>{
        const {email , password } = createuserDto;

        //Verify if email already exists
        const UserExist = await this.userService.findUserByEMail(email);

        if(UserExist){
            throw new BadRequestException("Un compte avec cette email existe deja ");
        }

        //hashe password
        const hashPassword = await bcrypt.hash(password, 12) 


        //create user 
        const newUser = await this.userService.createUser({
            email,
            password: hashPassword
        })

        const {password:_ , ...safeUser} = newUser

        return {user: safeUser}
    }


  private generateRefreshToken(): string {
     return crypto.randomBytes(64).toString('hex'); // 128 caractères aléatoires
}

async refresh(refreshToken: string) {
    
    
    // 1. Hash le token reçu
    const tokenHash = hashToken(refreshToken);

   
    // 2. Récupère userId depuis Redis
    const userId = await this.redisService.get(`refresh:${tokenHash}`);
   
    if (!userId) {
        throw new UnauthorizedException('Refresh token invalide ou expiré.');
    }

    // 3. Vérifie que l’utilisateur existe
    const user = await this.userService.findById(userId);
    if (!user) {
        throw new UnauthorizedException('Utilisateur introuvable.');
    }

    // 4. Rotation : supprime l’ancien token
    await this.redisService.del(`refresh:${tokenHash}`);

    // 5. Génère un NOUVEAU refresh token
    const newRefreshToken = this.generateRefreshToken();
    const newTokenHash = hashToken(newRefreshToken);
    const ttl = this.config.get<number>('JWT_REFRESH_TTL', 604800);
    await this.redisService.set(`refresh:${newTokenHash}`, userId, ttl);

    // 6. Génère un nouvel access token
    const access_token = this.jwtService.sign(
        { sub: user.id, email: user.email },
        {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN', '15m'),
        }
    );

    return {
        access_token,
        refresh_token: newRefreshToken, // le client doit l'utiliser pour le prochain refresh
    };
}
    
    async logout(userId: string) {
        await this.redisService.del(`user:${userId}:refresh`);
    }
}

