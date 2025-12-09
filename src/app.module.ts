import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>({
        type: 'postgres',
        host: configService.get('DB_HOST' , 'localhost') ,
        port: configService.get('DB_PORT' , 5432),
        username: configService.get("DB_USERNAME", "authuser"),
        password: configService.get("DB_PASSWORD","securepassword123"),
        database: configService.get('DB_NAME', 'authsystem'),
        autoLoadEntities: true,
        synchronize: true
      })
    }),

    UsersModule,

    AuthModule,

    RedisModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
