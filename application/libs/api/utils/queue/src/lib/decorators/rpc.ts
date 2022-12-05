import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { applyDecorators } from '@nestjs/common';
import { RmqModule } from '../rmq.module';
import { Decorators } from './interfaces';

export function Rpc(
  routingKey: string,
  queueName: string,
  exchange: string = RmqModule.GLOBAL_EXCHANGE.name
): Decorators {
  const fullQueueName = `${queueName}-${exchange}_${routingKey}`;

  return applyDecorators(
    RabbitRPC({
      exchange: exchange,
      createQueueIfNotExists: true,
      queue: fullQueueName,
      routingKey: routingKey,
      queueOptions: {
        durable: true,
      },
    })
  );
}
