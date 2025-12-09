import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
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
      return {
         access_token: this.jwtService.sign(payload),
          user,
    };
  }






    /**
     * Inscription nouvelle utilisateur
     */

    async signup(createuserDto: CreateUserDto): Promise<{user: Omit<User, 'password'>}>{
        const {email , password } = createuserDto;

        //Verify if email already exists
        const UserExist = this.userService.findUserByEMail(email);

        if(!UserExist){
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
}
