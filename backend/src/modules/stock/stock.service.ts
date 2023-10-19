import { Injectable, Logger } from '@nestjs/common';
import { AlphaVantageClientService } from '../alphavantage/alphavantage.service';

import {
  Ticker,
  TickerNewsItem,
  TimeSeriesDailyAdjustedResponse,
  TimeSeriesMonthlyAdjustedResponse,
  TimeSeriesWeeklyAdjustedResponse,
} from './stock.interace';
import { StockRepository } from '../../repositories/stock.repository';
import { ClientSession } from 'mongoose';
import { CreateStockDto } from './dto/createStock.dto';
import { DarqubeClientService } from '../darqube/darqube.service';
import {
  DarqubeBalanceSheetResponse,
  DarqubeCashFlowResponse,
  DarqubeIncomeStatementResponse,
  DarqubeTickerMarketData,
  DarqubeTickerTweet,
} from '../darqube/darqube.interface';

@Injectable()
export class StockService {
  private logger = new Logger(StockService.name);

  constructor(
    private readonly stockRepository: StockRepository,
    private readonly alphaVantageClientService: AlphaVantageClientService,
    private readonly darqubeClientService: DarqubeClientService,
  ) {}

  async creatStock(createStockDto: CreateStockDto, session: ClientSession) {
    return await this.stockRepository.createStock(createStockDto, session);
  }

  public async getAllStocks(): Promise<any> {
    return this.stockRepository.getAllStocks();
  }
  public async deleteDBStockById(id: string): Promise<void> {
    await this.stockRepository.deleteStockById(id);
  }
  public async getDailyTickerData(
    ticker: Ticker,
    startDate: number,
    interval: '1d',
  ): Promise<DarqubeTickerMarketData[]> {
    return this.darqubeClientService.getTicketMarketData(
      ticker,
      startDate,
      interval,
    );
  }

  public async getTickerIncomeStatement(
    ticker: Ticker,
  ): Promise<DarqubeIncomeStatementResponse> {
    return this.darqubeClientService.getTickerIncomeStatement(ticker);
  }

  public async getTickerCashFlow(
    ticker: Ticker,
  ): Promise<DarqubeCashFlowResponse> {
    return this.darqubeClientService.getTickerCashFlow(ticker);
  }

  public async getTickerBalanceSheet(
    ticker: Ticker,
  ): Promise<DarqubeBalanceSheetResponse> {
    return this.darqubeClientService.getTickerBalanceSheet(ticker);
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

  // TODO: Use this to show news
  public async getStockNewsByTicker(
    ticker: string,
    provider: 'alphaVantage' | 'darqube',
  ): Promise<TickerNewsItem[]> {
    if (provider === 'alphaVantage') {
      const response = await this.alphaVantageClientService.getTickerNews(
        ticker,
      );
      return response.map((item) => ({
        source: item.source,
        title: item.title,
        url: item.url,
        publishedAt: Number(item.time_published),
        // optionals
        authors: item.authors,
        summary: item.summary,
        img: item.banner_image,
      }));
    }
    const response = await this.darqubeClientService.getTickerNews(ticker);

    return response.map((item) => ({
      source: item.source,
      title: item.title,
      url: item.url,
      publishedAt: item.published_at * 1000,
      score: {
        neg: item.score.neg,
        neu: item.score.neu,
        pos: item.score.pos,
        compound: item.score.compound,
      },
    }));
  }
  public async getStockTweetsByTicker(
    ticker: string,
  ): Promise<DarqubeTickerTweet[]> {
    return this.darqubeClientService.getTickerTweets(ticker);
  }
}
