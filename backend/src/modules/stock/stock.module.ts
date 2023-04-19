import { Module } from '@nestjs/common';
import { AlphaVantageClientModule } from '../alphavantage/alphavantage.module';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';


@Module({
  imports: [AlphaVantageClientModule],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
