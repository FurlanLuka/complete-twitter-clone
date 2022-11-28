import {
  Type,
  DynamicModule,
  ForwardReference,
  InjectionToken,
  OptionalFactoryDependency,
} from '@nestjs/common';

export enum ConnectionType {
  SINGULAR,
  MULTI,
}

export interface SingularConnectionOptions {
  type: ConnectionType.SINGULAR;
  connectionName: string;
  connectionUrl: string;
  keyPrefix?: string;
}

export interface MultiConnectionOptions {
  type: ConnectionType.MULTI;
  connections: SingularConnectionOptions[];
}

export type RedisConfig = SingularConnectionOptions | MultiConnectionOptions;

export interface RedisOptions {
  imports: Array<
    Type | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
  inject: (InjectionToken | OptionalFactoryDependency)[];
  useFactory: (...args: unknown[]) => RedisConfig;
}
