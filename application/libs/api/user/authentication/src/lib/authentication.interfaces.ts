import { Type, DynamicModule, ForwardReference, InjectionToken, OptionalFactoryDependency } from "@nestjs/common";

export interface AuthenticationConfig {
  secretKey: string;
  audience: string;
  issuer: string;
}

export interface AuthenticationOptions {
  imports: Array<
    Type | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
  inject: (InjectionToken | OptionalFactoryDependency)[];
  useFactory: (...args: unknown[]) => AuthenticationConfig;
}