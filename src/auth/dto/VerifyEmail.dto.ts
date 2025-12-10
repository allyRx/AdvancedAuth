import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class VerifyEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Matches(/^\d{6}$/, { message: 'Le code doit avoir 6 chiffres.' })
  code: string;
}