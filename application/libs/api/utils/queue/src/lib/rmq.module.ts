import { DynamicModule, Logger, Module, Provider } from '@nestjs/common';
import { RabbitMQConfig, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RmqExchangeUtil } from './rmq-exchange.util';
import { RmqService } from './rmq.service';
import { RabbitMQModuleConfig } from './rmq.interfaces';

@Module({})
export class RmqModule {
  static GLOBAL_EXCHANGE = {
    name: 'archie.microservice.tx',
    type: 'topic',
  };

  static register(options: RabbitMQModuleConfig): DynamicModule {
    const rmqConfigFactory = (...args): RabbitMQConfig => {
      const config = options.useFactory(...args);

      return {
        ...config,
        exchanges: RmqExchangeUtil.createExchanges([
          {
            ...this.GLOBAL_EXCHANGE,
            initDeadLetterExchange: true,
            initRetryExchange: true,
          },
        ]),
        enableControllerDiscovery: true,
        connectionInitOptions: {
          wait: false,
        },
        logger: new Logger()
      };
    };

    const imports = [
      RabbitMQModule.forRootAsync(RabbitMQModule, {
        imports: options.imports,
        inject: options.inject,
        useFactory: rmqConfigFactory,
      }),
    ];

    const exports: Provider[] = [RabbitMQModule, RmqService];
    const providers: Provider[] = [RmqService];

    return {
      module: RmqModule,
      providers,
      imports,
      exports,
      global: true,
    };
  }
}
