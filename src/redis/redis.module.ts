import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createClient } from 'redis';
import { RedisService } from './redis.service';

@Module({
    imports: [
        ConfigModule
    ],
  providers : [
    {
        provide: 'REDIS_CLIENT',
        async useFactory() {
            const client = createClient({
                url: process.env.REDIS_SERVER
            });
            await client.connect();
            
            return client;
        },
    },
   RedisService
  ],
  exports: [RedisService]
})
export class RedisModule {}
