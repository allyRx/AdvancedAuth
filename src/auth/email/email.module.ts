import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';

@Module({
     imports: [ConfigModule], // pour accéder à .env
  providers: [EmailService],
  exports: [EmailService], // pour l'utiliser dans AuthModule
})
export class EmailModule {
   
}
