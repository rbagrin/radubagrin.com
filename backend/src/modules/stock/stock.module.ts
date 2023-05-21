import { Module } from '@nestjs/common';
import { AlphaVantageClientModule } from '../alphavantage/alphavantage.module';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { StockRepository } from '../../repositories/stock.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Stock, StockSchema } from '../../entities/stock.entity';
import { DarqubeClientModule } from '../darqube/darqube.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stock.name, schema: StockSchema }]),
    AlphaVantageClientModule,
    DarqubeClientModule,
  ],
  controllers: [StockController],
  providers: [StockService, StockRepository],
  exports: [StockService, StockRepository],
})
export class StockModule {}
