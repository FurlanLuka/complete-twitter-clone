import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from '@twitr/api/utils/health';
import { RedisModule } from '@twitr/api/utils/redis';
import {
  TimelineWorkerConstants,
  TIMELINE_CACHE,
  TIMELINE_CACHE_PREFIX,
  TWEET_CACHE,
  TWEET_CACHE_PREFIX,
} from '@twitr/api/timeline/constants';
import { ConfigModule, ConfigService } from '@twitr/api/utils/config';
import { AuthenticationModule } from '@twitr/api/user/authentication';
import { RmqModule } from '@twitr/api/utils/queue';
import { TimelineModule, TweetModule } from '@twitr/api/timeline/timeline';

@Module({
  imports: [
    ConfigModule.register({
      requiredEnvironmentVariables: [
        TimelineWorkerConstants.QUEUE_URL,
        TimelineWorkerConstants.REDIS_URL,
        TimelineWorkerConstants.TYPEORM_DATABASE,
        TimelineWorkerConstants.TYPEORM_HOST,
        TimelineWorkerConstants.TYPEORM_PASSWORD,
        TimelineWorkerConstants.TYPEORM_PORT,
        TimelineWorkerConstants.TYPEORM_USERNAME,
      ],
    }),
    HealthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get(TimelineWorkerConstants.TYPEORM_HOST),
        username: configService.get(TimelineWorkerConstants.TYPEORM_USERNAME),
        password: configService.get(TimelineWorkerConstants.TYPEORM_PASSWORD),
        database: configService.get(TimelineWorkerConstants.TYPEORM_DATABASE),
        port: configService.get(TimelineWorkerConstants.TYPEORM_PORT),
        synchronize: true,
        autoLoadEntities: true,
        keepConnectionAlive: true,
      }),
      inject: [ConfigService],
    }),
    RedisModule.register({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connections: [
          {
            connectionName: TIMELINE_CACHE,
            keyPrefix: TIMELINE_CACHE_PREFIX,
            connectionUrl: configService.get(TimelineWorkerConstants.REDIS_URL),
          },
          {
            connectionName: TWEET_CACHE,
            keyPrefix: TWEET_CACHE_PREFIX,
            connectionUrl: configService.get(TimelineWorkerConstants.REDIS_URL),
          },
        ],
      }),
      inject: [ConfigService],
    }),
    RmqModule.register({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get(TimelineWorkerConstants.QUEUE_URL),
      }),
      inject: [ConfigService],
    }),
    AuthenticationModule.register({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        audience: configService.get(TimelineWorkerConstants.AUTH_AUDIENCE),
        issuer: configService.get(TimelineWorkerConstants.AUTH_ISSUER),
        secretKey: configService.get(TimelineWorkerConstants.AUTH_SECRET),
      }),
      inject: [ConfigService],
    }),
    TimelineModule,
    TweetModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
