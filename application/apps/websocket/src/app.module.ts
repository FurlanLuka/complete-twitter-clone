import { Module } from '@nestjs/common';
import { HealthModule } from '@twitr/api/utils/health';
import {
  WebsocketConstants,
  WEBSOCKET_TOKEN_CACHE,
  WEBSOCKET_TOKEN_CACHE_PREFIX,
} from '@twitr/api/websocket/constants';
import { ConfigModule, ConfigService } from '@twitr/api/utils/config';
import { AuthenticationModule } from '@twitr/api/user/authentication';
import { RmqModule } from '@twitr/api/utils/queue';
import { RedisModule } from '@twitr/api/utils/redis';
import {
  WebsocketEventModule,
  WebsocketModule,
} from '@twitr/api/websocket/websocket';

@Module({
  imports: [
    ConfigModule.register({
      requiredEnvironmentVariables: [
        WebsocketConstants.QUEUE_URL,
        WebsocketConstants.AUTH_AUDIENCE,
        WebsocketConstants.AUTH_ISSUER,
        WebsocketConstants.AUTH_SECRET,
      ],
    }),
    HealthModule,
    RmqModule.register({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get(WebsocketConstants.QUEUE_URL),
      }),
      inject: [ConfigService],
    }),
    RedisModule.register({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connections: [
          {
            connectionName: WEBSOCKET_TOKEN_CACHE,
            keyPrefix: WEBSOCKET_TOKEN_CACHE_PREFIX,
            connectionUrl: configService.get(WebsocketConstants.REDIS_URL),
          },
        ],
      }),
      inject: [ConfigService],
    }),
    AuthenticationModule.register({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        audience: configService.get(WebsocketConstants.AUTH_AUDIENCE),
        issuer: configService.get(WebsocketConstants.AUTH_ISSUER),
        secretKey: configService.get(WebsocketConstants.AUTH_SECRET),
      }),
      inject: [ConfigService],
    }),
    WebsocketModule,
    WebsocketEventModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
