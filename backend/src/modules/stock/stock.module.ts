import { Module } from '@nestjs/common';
import { AlphaVantageClientModule } from '../alphavantage/alphavantage.module';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { IEXCloudClientModule } from '../iexcloud/iexcloud.module';

@Module({
  imports: [AlphaVantageClientModule, IEXCloudClientModule],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
