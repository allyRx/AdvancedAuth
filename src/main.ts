import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        //  Supprime les propriétés non définies dans le DTO
      forbidNonWhitelisted: true, //  Renvoie une erreur si des champs inconnus sont envoyés
      transform: true,        // Convertit automatiquement les payloads en instances de DTO
      disableErrorMessages: false, // Garde les messages d’erreur utiles (à désactiver en prod si besoin)
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
