// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';

/**
 * Stratégie Passport pour valider les JWT access tokens.
 * - Extrait le token du header Authorization: Bearer <token>
 * - Vérifie la signature avec le secret JWT_ACCESS_SECRET
 * - Charge l'utilisateur depuis la base de données
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    
    super({
      // 1. Où chercher le token ?
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // 2. Vérifier la validité même si expiré ? Non.
      ignoreExpiration: false,

      // 3. Secret pour vérifier la signature
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),

      // 4. Pour accéder au token brut dans validate() (optionnel mais utile)
      passReqToCallback: true,
    });
  }

  /**
   * Appelée si le JWT est valide (signature OK, non expiré).
   * @param req La requête HTTP (grâce à passReqToCallback: true)
   * @param payload Le contenu décodé du JWT (sub, email, etc.)
   * @returns L'utilisateur complet (sans mot de passe)
   */

  async validate(req: Request, payload: { sub: string; email: string }) {
    const user = await this.usersService.findById(payload.sub);
    
    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable.');
    }
    return user;
  }
}