// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'; 
import { LoginDto } from 'src/users/dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Auth') 
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED) // renvoie 201 au lieu de 200
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès.' })
  @ApiResponse({ status: 400, description: 'Email déjà utilisé ou données invalides.' })
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }


  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    }
    return this.authService.login(user);
  }

@Post('refresh')
@HttpCode(HttpStatus.OK)
async refresh(@Body() dto: RefreshTokenDto) {
  return this.authService.refresh(dto.refresh_token);
}
  // AuthController
// @Post('logout')
// @UseGuards(JwtAuthGuard) // 👈 à créer à l’étape suivante
// async logout(@Req() req) {
//   await this.authService.logout(req.user.sub);
//   return { message: 'Déconnecté avec succès.' };
// }

}