import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorMiddleware } from '../middleware/error.middleware';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Usar el middleware global
   new ErrorMiddleware()

   const port = process.env.PORT || 8080;
   app.use(cookieParser());

  await app.listen(port);
}
bootstrap(); 
