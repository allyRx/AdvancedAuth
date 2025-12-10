// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UnauthorizedException,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'; 
import { LoginDto } from 'src/users/dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Public } from './decorators/publicRoute.decorators';
import { JwtAuthGuard } from './decorators/auth.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enum/role.enum';
import { RolesGuard } from './guards/roles.guard';


@ApiTags('Auth') 
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

    @Post('signup')
    @Public()
    @HttpCode(HttpStatus.CREATED) // renvoie 201 au lieu de 200
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès.' })
    @ApiResponse({ status: 400, description: 'Email déjà utilisé ou données invalides.' })
    async signup(@Body() createUserDto: CreateUserDto) {
      return this.authService.signup(createUserDto);
    }


    @Post('login')
    @Public()
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

    @Post('logout')
    async logout(@Body('refresh_token') refreshToken: string) {
    await this.authService.logout(refreshToken);
    return { message: 'Déconnecté.' };
    }


    @UseGuards(JwtAuthGuard ,RolesGuard)
    @Roles(Role.User)
    @Get('profile')
    async getProfile(@Req() req:any) {
    // req.user est fourni par JwtStrategy.validate()
     return req.user;
    }       
}