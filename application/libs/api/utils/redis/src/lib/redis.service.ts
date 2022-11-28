import {
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ConnectionType, RedisConfig } from './redis.interfaces';
import { Connection } from './connection/connection';

@Injectable()
export class RedisService implements OnModuleInit {
  private connections: Map<string, Connection> = new Map();

  constructor(@Inject('CONFIG') private options: RedisConfig) {}

  onModuleInit() {
    if (this.options.type === ConnectionType.SINGULAR) {
      this.connections.set(
        this.options.connectionName,
        new Connection(this.options.connectionUrl, this.options.keyPrefix)
      );
    } else {
      this.options.connections.forEach((connection) => {
        this.connections.set(
          connection.connectionName,
          new Connection(connection.connectionUrl, connection.keyPrefix)
        );
      });
    }
  }

  forConnection(connectionName: string): Connection {
    if (this.connections.has(connectionName)) {
      return this.connections.get(connectionName);
    }

    throw new InternalServerErrorException(
      `CONNECTION - ${connectionName} - not available.`
    );
  }
}
