import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import express from 'express';
import compression from 'compression';

function setupGlobalPrefix(app: INestApplication) {
  app.setGlobalPrefix('api');
}

function enableCors(app: INestApplication) {
  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });
}

function setupGlobalPipes(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
}

function setupMiddleware(app: INestApplication) {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(compression());
}

function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Nest-js Swagger Example API')
    .setDescription('Swagger Example API description')
    .setVersion('1.0')
    .addServer('http://localhost:3001')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);
}

export function setup(app: INestApplication) {
  setupGlobalPrefix(app);
  enableCors(app);
  setupGlobalPipes(app);
  setupMiddleware(app);
  setupSwagger(app);
}
