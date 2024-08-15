import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { loggerOptions } from '@config/logger.config';
import { setupMiddlewares } from '@config/middlewares';
import { MainModule } from './main.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule, {
    logger: loggerOptions,
    rawBody: true,
  });
  setupMiddlewares(app);
  await app.listen(process.env.PORT);
}

bootstrap();
