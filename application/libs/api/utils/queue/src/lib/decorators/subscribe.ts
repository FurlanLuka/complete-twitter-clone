import {
  MessageHandlerOptions,
  QueueOptions,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { applyDecorators, Logger, SetMetadata } from '@nestjs/common';
import {
  ackErrorHandler,
  defaultNackErrorHandler,
} from '@golevelup/nestjs-rabbitmq/lib/amqp/errorBehaviors';
import { Channel, ConsumeMessage } from 'amqplib';
import { RmqExchangeUtil } from '../rmq-exchange.util';
import { Decorators, SubscriptionOptions, SubscriptionOptionsWithDefaults } from './interfaces';
import { Event } from '../event/event';
import { RmqModule } from '../rmq.module';

export const RABBIT_RETRY_HANDLER = 'RABBIT_RETRY_HANDLER';

export function Subscribe(
  event: Event<unknown>,
  queueName: string,
  options?: SubscriptionOptions,
): Decorators {
  const subscriptionOptions: SubscriptionOptionsWithDefaults = {
    onError: {
      retry: true,
      deadLetter: true,
      retryInitialDelayInMs: 20_000,
      maxRetries: 5,
      retryBackoffMultiplier: 2,
    },
    exchange: options?.exchange ?? RmqModule.GLOBAL_EXCHANGE.name,
    queue: options?.queue ?? {},
  };

  const routingKey = event.getRoutingKey();
  const queueSpecificRoutingKey = `${queueName}-${routingKey}`;
  const fullQueueName = `${queueName}-${subscriptionOptions.exchange}_${routingKey}`;
  const customArguments = subscriptionOptions.queue.arguments

  const queueOptions: QueueOptions = {
    ...subscriptionOptions.queue,
    durable: true,
    arguments: subscriptionOptions.onError.deadLetter
        ? {
          ...customArguments,
          'x-dead-letter-exchange': RmqExchangeUtil.getDeadLetterExchangeName(
              subscriptionOptions.exchange,
          ),
          'x-dead-letter-routing-key': queueSpecificRoutingKey,
        }
        : customArguments,
  };

  const baseMessageHandlerOptions: MessageHandlerOptions = {
    createQueueIfNotExists: true,
    queue: fullQueueName,
    errorHandler: createErrorHandler(
      queueSpecificRoutingKey,
      subscriptionOptions,
      subscriptionOptions.exchange,
      event.getOptions().isSensitive,
    ),
    queueOptions,
  };

  const decorators: MethodDecorator[] = [
      RabbitSubscribe({
        exchange: subscriptionOptions.exchange,
        routingKey: routingKey,
        ...baseMessageHandlerOptions,
    }),
  ];

  if (subscriptionOptions.onError.retry) {
    decorators.push(
      SetMetadata(RABBIT_RETRY_HANDLER, {
        type: 'subscribe',
        routingKey: queueSpecificRoutingKey,
        exchange: RmqExchangeUtil.getRetryExchangeName(
          subscriptionOptions.exchange,
        ),
        ...baseMessageHandlerOptions,
      }),
    );
  }

  return applyDecorators(...decorators);
}

function createErrorHandler(
  queueSpecificRoutingKey: string,
  options: SubscriptionOptionsWithDefaults,
  exchange: string,
  logEventPayload: boolean,
): (
  channel: Channel,
  msg: ConsumeMessage,
  error: unknown,
) => void | Promise<void> {
  return (channel: Channel, msg: ConsumeMessage, error) => {
    const messageHeaders = msg.properties.headers;
    const retryAttempt: number = messageHeaders['x-retry'] ?? 0;

    Logger.error({
      message: `Event handling failed for routing key "${queueSpecificRoutingKey}"`,
      payload: logEventPayload ? msg.content.toString() : undefined,
      error,
      requeue: options.onError.retry,
      retryAttempt,
    });

    if (options.onError.retry) {
      const delay: number =
        messageHeaders['x-delay'] ?? options.onError.retryInitialDelayInMs / options.onError.retryBackoffMultiplier;

      if (retryAttempt < options.onError.maxRetries) {
        const retryHeaders = {
          ...messageHeaders,
          'x-delay': delay * options.onError.retryBackoffMultiplier,
          'x-retry': retryAttempt + 1,
          'event-id': messageHeaders['event-id'],
        };

        channel.publish(
          RmqExchangeUtil.getRetryExchangeName(exchange),
          queueSpecificRoutingKey,
          msg.content,
          {
            headers: retryHeaders,
          },
        );
      } else {
        return pushToDeadLetterQueue(channel, msg, error);
      }
    }

    return ackErrorHandler(channel, msg, error);
  };
}

function pushToDeadLetterQueue(
  channel: Channel,
  msg: ConsumeMessage,
  error,
): void | Promise<void> {
  return defaultNackErrorHandler(channel, msg, error);
}
