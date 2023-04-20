import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const DEV_PORT = 4000;
const PROD_PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PROD_PORT);
}

bootstrap();
