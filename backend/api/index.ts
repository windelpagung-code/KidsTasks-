import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import cookieParser from 'cookie-parser';
import express from 'express';

const server = express();

let app: any;

async function createApp() {
  if (!app) {
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
      { rawBody: true },
    );

    nestApp.use(cookieParser());
    nestApp.setGlobalPrefix('api/v1');

    nestApp.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    nestApp.enableCors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    });

    await nestApp.init();
    app = server;
  }
  return app;
}

export default async (req: any, res: any) => {
  try {
    const app = await createApp();
    app(req, res);
  } catch (error: any) {
    console.error('NestJS init error:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};
