import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { StockService } from './stock.service';
import {
  IEXCloudBalanceSheet,
  IEXCloudHistoricalData,
  IEXCloudIncomeStatement,
} from '../iexcloud/iexcloud.interface';

import {
  Ticker,
  TimeSeriesDailyAdjustedResponse,
  TimeSeriesMonthlyAdjustedResponse,
  TimeSeriesWeeklyAdjustedResponse,
} from './stock.interace';
import { Response } from 'express';
import { CreateStockDto } from './dto/createStock.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('/api/stocks')
export class StockController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private readonly stockService: StockService,
  ) {}

  @Get('/:ticker/daily-data')
  async getDailyStockData(
    @Param('ticker') ticker: Ticker,
  ): Promise<IEXCloudHistoricalData[]> {
    return this.stockService.getDailyTickerData(ticker);
  }
  @Get('/:ticker/income-statement')
  async getStockIncomeStatement(
    @Param('ticker') ticker: Ticker,
    @Query('frequency') frequency: 'quarterly' | 'annual',
    @Query('last', ParseIntPipe) last: number,
  ): Promise<IEXCloudIncomeStatement[]> {
    return this.stockService.getTickerIncomeStatement(ticker, frequency, last);
  }

  @Get('/:ticker/balance-sheet')
  async getStockBalanceSheet(
    @Param('ticker') ticker: Ticker,
    @Query('frequency') frequency: 'quarterly' | 'annual',
    @Query('last', ParseIntPipe) last: number,
  ): Promise<IEXCloudBalanceSheet[]> {
    return this.stockService.getTickerBalanceSheet(ticker, frequency, last);
  }
  @Get('/:ticker/daily-adjusted')
  async getDailyAdjustedStockData(
    @Param('ticker') ticker: string,
  ): Promise<TimeSeriesDailyAdjustedResponse> {
    return this.stockService.getDailyAdjustedStockDataByTicker(ticker);
  }

  @Get('/:ticker/weekly-adjusted')
  async getWeeklyAdjustedStockData(
    @Param('ticker') ticker: string,
  ): Promise<TimeSeriesWeeklyAdjustedResponse> {
    return this.stockService.getWeeklyAdjustedStockDataByTicker(ticker);
  }

  @Get('/:ticker/montlhy-adjusted')
  async getMonthlyAdjustedStockData(
    @Param('ticker') ticker: string,
  ): Promise<TimeSeriesMonthlyAdjustedResponse> {
    return this.stockService.getMonthlyAdjustedStockDataByTicker(ticker);
  }

  @Get('/:ticker/news')
  async getStockNews(
    @Param('ticker') ticker: string,
  ): Promise<TimeSeriesMonthlyAdjustedResponse> {
    return this.stockService.getStockNewsaByTicker(ticker);
  }

  @Get('/')
  async getAllStocks(): Promise<any> {
    return this.stockService.getAllStocks();
  }

  @Post('/')
  async createUser(
    @Body() createStockDto: CreateStockDto,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    try {
      const newStock: any = await this.stockService.creatStock(
        createStockDto,
        session,
      );
      await session.commitTransaction();
      return res.status(HttpStatus.CREATED).send(newStock);
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      await session.endSession();
    }
  }
}
