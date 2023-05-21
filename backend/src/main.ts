import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as dotenv from 'dotenv';
import { ConfigService } from './infra/config/config.service';

async function bootstrap() {
  // if (process.env.NODE_ENV !== 'production') {
  //   dotenv.config();
  // }

  const app = await NestFactory.create(AppModule, { bodyParser: true });
  const config = new ConfigService();

  // TODO: Connect to mongo db then call app.listen: https://docs.cyclic.sh/how-to/using-mongo-db#connections-in-a-serverless-runtime
  await app.listen(await config.getPortConfig());
}

bootstrap();
