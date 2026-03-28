import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true, bodyParser: true });
  app.use(require('express').json({ limit: '5mb' }));
  app.use(require('express').urlencoded({ limit: '5mb', extended: true }));

  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('KidsTasks API')
    .setDescription('Sistema Gamificado de Controle de Mesada Infantil')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'KidsTasks API',
    customfavIcon: 'https://kidstasks1.vercel.app/logo.png',
    customCss: `
      .swagger-ui .topbar { background: linear-gradient(135deg, #0f0a1e, #3b1f7a); }
      .swagger-ui .topbar-wrapper img { content: url('https://kidstasks1.vercel.app/logo.png'); height: 40px; width: auto; }
      .swagger-ui .topbar-wrapper .link span { display: none; }
    `,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`KidsTasks API running on port ${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();
