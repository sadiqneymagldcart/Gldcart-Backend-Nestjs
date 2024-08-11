import { NestFactory } from '@nestjs/core';
import { LogLevel } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setupMiddlewares } from '@config/middlewares';
import { MainModule } from './main.module';

async function bootstrap() {
  const loggerOptions: LogLevel[] =
    process.env.NODE_ENV === 'development'
      ? ['log', 'debug', 'error', 'verbose', 'warn']
      : ['error', 'warn', 'log'];

  const app = await NestFactory.create<NestExpressApplication>(MainModule, {
    logger: loggerOptions,
    rawBody: true,
  });
  setupMiddlewares(app);
  await app.listen(process.env.PORT);
}

bootstrap();
