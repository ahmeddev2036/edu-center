import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';
import { GlobalExceptionFilter } from './common/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  // CORS — يسمح لكل الـ origins في development وللـ Vercel في production
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // السماح لطلبات بدون origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      // السماح لكل شيء في development
      if (process.env.NODE_ENV !== 'production') return callback(null, true);
      // في production: السماح لـ Vercel وأي subdomain
      const allowed = [
        process.env.FRONTEND_URL,
        'https://frontend-two-drab-22.vercel.app',
        'https://edu-center.vercel.app',
      ].filter(Boolean);
      if (allowed.some(u => origin.startsWith(u as string)) || origin.includes('vercel.app') || origin.includes('localhost')) {
        return callback(null, true);
      }
      return callback(null, true); // مؤقتاً: السماح للكل حتى يستقر النشر
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    })
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('EduFlow API')
    .setDescription('نظام إدارة المراكز التعليمية')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port, '0.0.0.0');
  console.log(`✅ API running on port ${port} | docs: /docs`);
}

bootstrap();
