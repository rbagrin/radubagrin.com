import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
  Ticker,
  TickerNewsItem,
  TimeSeriesDailyAdjustedResponse,
  TimeSeriesMonthlyAdjustedResponse,
  TimeSeriesWeeklyAdjustedResponse,
} from './stock.interace';
import { Response } from 'express';
import { CreateStockDto } from './dto/createStock.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import {
  DarqubeBalanceSheetResponse,
  DarqubeCashFlowResponse,
  DarqubeIncomeStatementResponse,
  DarqubeTickerMarketData,
  DarqubeTickerTweet,
} from '../darqube/darqube.interface';
import { AlphavantageOverviewResponse } from '../alphavantage/alphavantage.interface';

@Controller('/api/stocks')
export class StockController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private readonly stockService: StockService,
  ) {}

  @Get('/:ticker/market-data')
  async getDailyStockData(
    @Param('ticker') ticker: Ticker,
    @Query('startDate', ParseIntPipe) startDate: number,
    @Query('interval') interval: '1d',
  ): Promise<DarqubeTickerMarketData[]> {
    return this.stockService.getDailyTickerData(ticker, startDate, interval);
  }

  // TODO: More charts/data
  @Get('/:ticker/income-statement')
  async getStockIncomeStatement(
    @Param('ticker') ticker: Ticker,
  ): Promise<DarqubeIncomeStatementResponse> {
    return this.stockService.getTickerIncomeStatement(ticker);
  }

  // TODO: Use this to show relevant data + More charts/data
  @Get('/:ticker/cash-flow')
  async getStockCashFlow(
    @Param('ticker') ticker: Ticker,
  ): Promise<DarqubeCashFlowResponse> {
    return this.stockService.getTickerCashFlow(ticker);
  }

  // TODO: More charts/data
  @Get('/:ticker/balance-sheet')
  async getStockBalanceSheet(
    @Param('ticker') ticker: Ticker,
  ): Promise<DarqubeBalanceSheetResponse> {
    return this.stockService.getTickerBalanceSheet(ticker);
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

  @Get('/:ticker/company-overview')
  async getCompanyOverview(
    @Param('ticker') ticker: string,
  ): Promise<AlphavantageOverviewResponse> {
    return this.stockService.getCompanyOverviewByTicker(ticker);
  }

  @Get('/:ticker/news')
  async getStockNews(
    @Param('ticker') ticker: string,
    @Query('provider') provider: 'alphaVantage' | 'darqube' = 'darqube',
  ): Promise<TickerNewsItem[]> {
    return this.stockService.getStockNewsByTicker(ticker, provider);
  }

  @Get('/:ticker/tweets')
  async getStockTweets(
    @Param('ticker') ticker: string,
  ): Promise<DarqubeTickerTweet[]> {
    return this.stockService.getStockTweetsByTicker(ticker);
  }

  @Get('/')
  async getAllStocks(): Promise<any> {
    return this.stockService.getAllStocks();
  }

  @Delete('/:id')
  async deleteDBStock(@Param('id') id: string): Promise<void> {
    await this.stockService.deleteDBStockById(id);
  }

  @Post('/')
  async createDBStock(
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
