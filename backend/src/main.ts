import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as dotenv from 'dotenv';
import { ConfigService } from './infra/config/config.service';

async function bootstrap() {
  // if (process.env.NODE_ENV !== 'production') {
  //   dotenv.config();
  // }

  console.log('AAA');
  const app = await NestFactory.create(AppModule, { bodyParser: true });
  const config = new ConfigService();

  await app.listen(await config.getPortConfig());
}

bootstrap();
