import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
  }
  
  const app = await NestFactory.create(AppModule, { bodyParser: true });
  await app.listen(process.env.BACKEND_PORT);
}

bootstrap();
