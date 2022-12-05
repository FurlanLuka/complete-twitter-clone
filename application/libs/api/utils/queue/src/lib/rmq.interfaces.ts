import {
  RabbitMQConfig,
  RabbitMQExchangeConfig,
} from '@golevelup/nestjs-rabbitmq';
import {
  DynamicModule,
  ForwardReference,
  InjectionToken,
  OptionalFactoryDependency,
  Type,
} from '@nestjs/common';

export interface RabbitMQExchange extends RabbitMQExchangeConfig {
  initRetryExchange?: boolean;
  initDeadLetterExchange?: boolean;
}

export interface RabbitMQModuleConfig {
  imports: Array<
    Type | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
  inject: (InjectionToken | OptionalFactoryDependency)[];
  useFactory: (...args: unknown[]) => RabbitMQConfig;
}

export enum RPCResponseType {
  SUCCESS = 0,
  ERROR = 1,
}

interface RPCSuccessResponse<T> {
  type: RPCResponseType.SUCCESS;
  data: T;
}

interface RPCErrorResponse {
  type: RPCResponseType.ERROR;
  message: string;
}

export type RPCResponse<T> = RPCSuccessResponse<T> | RPCErrorResponse;
