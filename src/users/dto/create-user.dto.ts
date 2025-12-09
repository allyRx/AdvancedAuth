// src/users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; 

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Adresse email valide, unique',
  })
  @IsEmail({}, { message: 'Veuillez fournir une adresse email valide.' })
  @IsNotEmpty({ message: 'L’email ne peut pas être vide.' })
  email: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description: 'Mot de passe d’au moins 8 caractères, avec majuscule, minuscule, chiffre et caractère spécial',
  })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Le mot de passe ne peut pas être vide.' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Le mot de passe doit contenir au moins : une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&).',
  })
  password: string;

}