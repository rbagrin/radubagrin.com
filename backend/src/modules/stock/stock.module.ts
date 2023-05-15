import { Module } from '@nestjs/common';
import { AlphaVantageClientModule } from '../alphavantage/alphavantage.module';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { IEXCloudClientModule } from '../iexcloud/iexcloud.module';
import { StockRepository } from '../../repositories/stock.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Stock, StockSchema } from '../../entities/stock.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stock.name, schema: StockSchema }]),
    AlphaVantageClientModule,
    IEXCloudClientModule,
  ],
  controllers: [StockController],
  providers: [StockService, StockRepository],
  exports: [StockService, StockRepository],
})
export class StockModule {}
