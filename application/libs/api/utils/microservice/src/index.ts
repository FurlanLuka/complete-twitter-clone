import { startService } from './lib/start-service';

export async function start(
  appName: string,
  module: unknown,
): Promise<void> {
  await startService(appName, module);
}
