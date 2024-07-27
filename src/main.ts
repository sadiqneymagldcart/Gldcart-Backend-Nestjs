import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { setupMiddlewares } from '@config/middlewares';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger:
      process.env.NODE_ENV === 'development'
        ? ['log', 'debug', 'error', 'verbose', 'warn']
        : ['error', 'warn', 'log'],
    rawBody: true,
  });
  const configService = app.get(ConfigService);
  setupMiddlewares(app);
  app.listen(configService.get('API_PORT') || 3001);
}

bootstrap();
