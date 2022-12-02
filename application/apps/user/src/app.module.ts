import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from '@twitr/api/utils/health';
import { RedisModule } from '@twitr/api/utils/redis';
import {
  UserConstants,
  TOKEN_CACHE,
  TOKEN_CACHE_PREFIX,
  FOLLOWER_CACHE,
  FOLLOWER_CACHE_PREFIX,
} from '@twitr/api/user/constants';
import { ConfigModule, ConfigService } from '@twitr/api/utils/config';
import { AuthenticationModule } from '@twitr/api/user/authentication';
import { RelationsModule, TweetModule, UserModule } from '@twitr/api/user/user';
import { RmqModule } from '@twitr/api/utils/queue';

@Module({
  imports: [
    ConfigModule.register({
      requiredEnvironmentVariables: [
        UserConstants.QUEUE_URL,
        UserConstants.REDIS_URL,
        UserConstants.TYPEORM_DATABASE,
        UserConstants.TYPEORM_HOST,
        UserConstants.TYPEORM_PASSWORD,
        UserConstants.TYPEORM_PORT,
        UserConstants.TYPEORM_USERNAME,
        UserConstants.AUTH_AUDIENCE,
        UserConstants.AUTH_ISSUER,
        UserConstants.AUTH_SECRET,
      ],
    }),
    HealthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get(UserConstants.TYPEORM_HOST),
        username: configService.get(UserConstants.TYPEORM_USERNAME),
        password: configService.get(UserConstants.TYPEORM_PASSWORD),
        database: configService.get(UserConstants.TYPEORM_DATABASE),
        port: configService.get(UserConstants.TYPEORM_PORT),
        synchronize: true,
        autoLoadEntities: true,
        keepConnectionAlive: true,
      }),
      inject: [ConfigService],
    }),
    RmqModule.register({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get(UserConstants.QUEUE_URL),
      }),
      inject: [ConfigService],
    }),
    RedisModule.register({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connections: [
          {
            connectionName: TOKEN_CACHE,
            keyPrefix: TOKEN_CACHE_PREFIX,
            connectionUrl: configService.get(UserConstants.REDIS_URL),
          },
          {
            connectionName: FOLLOWER_CACHE,
            keyPrefix: FOLLOWER_CACHE_PREFIX,
            connectionUrl: configService.get(UserConstants.REDIS_URL),
          },
        ],
      }),
      inject: [ConfigService],
    }),
    UserModule.register({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        audience: configService.get(UserConstants.AUTH_AUDIENCE),
        issuer: configService.get(UserConstants.AUTH_ISSUER),
        secretKey: configService.get(UserConstants.AUTH_SECRET),
      }),
      inject: [ConfigService],
    }),
    AuthenticationModule.register({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        audience: configService.get(UserConstants.AUTH_AUDIENCE),
        issuer: configService.get(UserConstants.AUTH_ISSUER),
        secretKey: configService.get(UserConstants.AUTH_SECRET),
      }),
      inject: [ConfigService],
    }),
    RelationsModule,
    TweetModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
