import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { StockModule } from './modules/stock/stock.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from './infra/config/config.module';
import { ConfigService } from './infra/config/config.service';
import { UserModule } from './modules/user/user.module';
import { PostgresDatabaseProviderModule } from './infra/db/postgres/postgres.module';
import { FibreNetworkModule } from './modules/fibre-network/fibre-network.module';

@Module({
  imports: [
    ConfigModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'build'),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.getMongoConfig(),
    }),
    PostgresDatabaseProviderModule,
    StockModule,
    UserModule,
    FibreNetworkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
