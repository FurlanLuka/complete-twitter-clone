import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export async function startService(
  _name: string,
  module: unknown,
): Promise<INestApplication> {
  const app = await NestFactory.create(module, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.json(),
          ),
        }),
      ],
    }),
    rawBody: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();

  await app.listen(process.env.PORT ?? 80);

  return app;
}
