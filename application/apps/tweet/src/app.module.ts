import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TweetModule } from '@twitr/api/tweet/tweet';
import { HealthModule } from '@twitr/api/utils/health';
import {
  TweetConstants,
} from '@twitr/api/tweet/constants';
import { ConfigModule, ConfigService } from '@twitr/api/utils/config';
import { AuthenticationModule } from '@twitr/api/user/authentication';
import { RmqModule } from '@twitr/api/utils/queue';

@Module({
  imports: [
    ConfigModule.register({
      requiredEnvironmentVariables: [
        TweetConstants.QUEUE_URL,
        TweetConstants.REDIS_URL,
        TweetConstants.TYPEORM_DATABASE,
        TweetConstants.TYPEORM_HOST,
        TweetConstants.TYPEORM_PASSWORD,
        TweetConstants.TYPEORM_PORT,
        TweetConstants.TYPEORM_USERNAME,
      ],
    }),
    TweetModule,
    HealthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get(TweetConstants.TYPEORM_HOST),
        username: configService.get(TweetConstants.TYPEORM_USERNAME),
        password: configService.get(TweetConstants.TYPEORM_PASSWORD),
        database: configService.get(TweetConstants.TYPEORM_DATABASE),
        port: configService.get(TweetConstants.TYPEORM_PORT),
        synchronize: true,
        autoLoadEntities: true,
        keepConnectionAlive: true,
      }),
      inject: [ConfigService],
    }),
    RmqModule.register({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get(TweetConstants.QUEUE_URL),
      }),
      inject: [ConfigService],
    }),
    AuthenticationModule.register({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        audience: configService.get(TweetConstants.AUTH_AUDIENCE),
        issuer: configService.get(TweetConstants.AUTH_ISSUER),
        secretKey: configService.get(TweetConstants.AUTH_SECRET),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
