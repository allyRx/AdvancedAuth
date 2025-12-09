import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsString({ message: 'Le refresh_token doit être une chaîne.' })
  @IsNotEmpty({ message: 'Le refresh_token est requis.' })
  refresh_token: string;
}