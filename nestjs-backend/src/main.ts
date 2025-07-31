import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS with proper configuration
  app.enableCors({
    origin: [
      'http://localhost:5173', // React development server
      // Add other allowed origins as needed
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Increase payload limit for image uploads
  app.use(json({ limit: '50mb' })); // Increased from 10mb to 50mb
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Get port from environment or use default
  const port = configService.get<number>('PORT') || 8001;

  await app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
    console.log(`CORS enabled for: ${JSON.stringify(app.getHttpServer()._events.request._events.options)}`);
  });
}

bootstrap().catch((err) => {
  console.error('Application failed to start', err);
  process.exit(1);
});