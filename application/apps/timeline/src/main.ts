import { AppModule } from './app.module';
import { start } from '@twitr/api/utils/microservice';
import { SERVICE_NAME } from '@twitr/api/timeline/constants';
import { Logger } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  await start(SERVICE_NAME, AppModule);
}

bootstrap().catch((error) => {
  Logger.error(error);
  throw error;
});
