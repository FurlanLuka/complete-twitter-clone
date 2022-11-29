import {
  Type,
  DynamicModule,
  ForwardReference,
  InjectionToken,
  OptionalFactoryDependency,
} from '@nestjs/common';

export interface UserConfig {
  secretKey: string;
  audience: string;
  issuer: string;
}

export interface UserOptions {
  imports: Array<
    Type | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
  inject: (InjectionToken | OptionalFactoryDependency)[];
  useFactory: (...args: unknown[]) => UserConfig;
}

export interface RefreshTokenData {
  handle: string;
  sub: string;
}