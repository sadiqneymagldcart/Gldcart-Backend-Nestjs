import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { setupMiddlewares } from '@config/middlewares';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger:
      process.env.NODE_ENV === 'development'
        ? ['log', 'debug', 'error', 'verbose', 'warn']
        : ['error', 'warn', 'log'],
    rawBody: true,
  });
  const port = app.get(ConfigService).get('PORT');
  setupMiddlewares(app);
  app.listen(port);
}

bootstrap();
