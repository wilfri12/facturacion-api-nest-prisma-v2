import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorMiddleware } from '../middleware/error.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Usar el middleware global
   new ErrorMiddleware()

  await app.listen(8080);
}
bootstrap(); 
