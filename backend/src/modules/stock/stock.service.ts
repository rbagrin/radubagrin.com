import { Injectable, Logger } from '@nestjs/common';
import { AlphaVantageClientService } from '../alphavantage/alphavantage.service';
import { IEXCloudClientService } from '../iexcloud/iexcloud.service';
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
import { UserRepository } from '../../repositories/user.repository';
import { StockRepository } from '../../repositories/stock.repository';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { ClientSession } from 'mongoose';
import { CreateStockDto } from './dto/createStock.dto';

@Injectable()
export class StockService {
  private logger = new Logger(StockService.name);

  constructor(
    private readonly stockRepository: StockRepository,
    private readonly alphaVantageClientService: AlphaVantageClientService,
    private readonly iexCloudClientService: IEXCloudClientService,
  ) {}

  async creatStock(createStockDto: CreateStockDto, session: ClientSession) {
    return await this.stockRepository.createStock(createStockDto, session);
  }

  public async getAllStocks(): Promise<any> {
    return this.stockRepository.getAllStocks();
  }
  public async getDailyTickerData(
    ticker: Ticker,
  ): Promise<IEXCloudHistoricalData[]> {
    return this.iexCloudClientService.getTickerHistoricalData(ticker);
  }

  public async getTickerIncomeStatement(
    ticker: Ticker,
    frequency: 'quarterly' | 'annual',
    last,
  ): Promise<IEXCloudIncomeStatement[]> {
    return this.iexCloudClientService.getTickerIncomeStatement(
      ticker,
      frequency,
      last,
    );
  }

  public async getTickerBalanceSheet(
    ticker: Ticker,
    frequency: 'quarterly' | 'annual',
    last,
  ): Promise<IEXCloudBalanceSheet[]> {
    return this.iexCloudClientService.getTickerBalanceSheet(
      ticker,
      frequency,
      last,
    );
  }

  public async getDailyAdjustedStockDataByTicker(
    ticker: string,
  ): Promise<TimeSeriesDailyAdjustedResponse> {
    return this.alphaVantageClientService.getTickerTimeSeriesDailyAdjustedData(
      ticker,
    );
  }

  public async getWeeklyAdjustedStockDataByTicker(
    ticker: string,
  ): Promise<TimeSeriesWeeklyAdjustedResponse> {
    return this.alphaVantageClientService.getTickerTimeSerieWeeklyAdjustedData(
      ticker,
    );
  }

  public async getMonthlyAdjustedStockDataByTicker(
    ticker: string,
  ): Promise<TimeSeriesMonthlyAdjustedResponse> {
    return this.alphaVantageClientService.getTickerTimeSerieMonthlyAdjustedData(
      ticker,
    );
  }

  public async getStockNewsaByTicker(
    ticker: string,
  ): Promise<TimeSeriesMonthlyAdjustedResponse> {
    return this.alphaVantageClientService.getTickerNews(ticker);
  }
}
