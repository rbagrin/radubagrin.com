import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ApiClientService } from 'src/infra/http/api-client/api-client.service';
import {
  Ticker,
  TimeSeriesDailyAdjustedResponse,
  TimeSeriesMonthlyAdjustedResponse,
  TimeSeriesWeeklyAdjustedResponse,
} from '../stock/stock.interace';
import {
  AlphavantageNewsItem,
  AlphavantageNewsResponse,
} from './alphavantage.interface';

@Injectable()
export class AlphaVantageClientService extends ApiClientService {
  logger = new Logger('Hexnode API Client');

  private apiKeys: string[];
  private apiKeyCounter: number;

  constructor(public httpService: HttpService) {
    super(httpService);
    // Both baseUrl and paths should finish in '/' !
    this.setApiClient(`https://www.alphavantage.co`);
    this.setHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    this.apiKeys = process.env.ALPHA_VANTAGE_API_KEY.split(',');
    this.apiKeyCounter = 0;
  }

  async getTickerTimeSeriesDailyAdjustedData(
    ticker: Ticker,
  ): Promise<TimeSeriesDailyAdjustedResponse> {
    const functionName = 'TIME_SERIES_DAILY_ADJUSTED';
    const apiKey = this.getApiKey();
    try {
      const { data } = await this.httpService
        .get<TimeSeriesDailyAdjustedResponse>(
          `/query?function=${functionName}&symbol=${ticker}&apikey=${apiKey}`,
        )
        .toPromise();
      return data;

      // const rows = data
      //   .trim()
      //   .split('\n')
      //   .map((row) => row.trim());
      // const keys = rows[0].split(',');
      // const objects = [];
      // for (let i = 1; i < rows.length; i++) {
      //   const values = rows[i].split(',');
      //   const obj = {};
      //   for (let j = 0; j < keys.length; j++) {
      //     obj[keys[j]] = values[j];
      //   }
      //   objects.push(obj);
      // }

      // return objects;
    } catch (error) {
      throw error;
    }
  }

  async getTickerTimeSerieWeeklyAdjustedData(
    ticker: Ticker,
  ): Promise<TimeSeriesWeeklyAdjustedResponse> {
    const functionName = 'TIME_SERIES_WEEKLY_ADJUSTED';
    const apiKey = this.getApiKey();
    try {
      const { data } = await this.httpService
        .get<TimeSeriesWeeklyAdjustedResponse>(
          `/query?function=${functionName}&symbol=${ticker}&apikey=${apiKey}`,
        )
        .toPromise();
      return data['Time Series (Daily)'];
    } catch (error) {
      throw error;
    }
  }

  async getTickerTimeSerieMonthlyAdjustedData(
    ticker: Ticker,
  ): Promise<TimeSeriesMonthlyAdjustedResponse> {
    const functionName = 'TIME_SERIES_MONTHLY_ADJUSTED';
    const apiKey = this.getApiKey();
    try {
      const { data } = await this.httpService
        .get<TimeSeriesMonthlyAdjustedResponse>(
          `/query?function=${functionName}&symbol=${ticker}&apikey=${apiKey}`,
        )
        .toPromise();
      return data['Time Series (Daily)'];
    } catch (error) {
      throw error;
    }
  }

  async getTickerNews(tickers: Ticker): Promise<AlphavantageNewsItem[]> {
    const functionName = 'NEWS_SENTIMENT';
    const apiKey = this.getApiKey();
    try {
      const { data } = await this.httpService
        .get<AlphavantageNewsResponse>(
          `/query?function=${functionName}&symbol=${tickers}&apikey=${apiKey}`,
        )
        .toPromise();
      return data.feed;
    } catch (error) {
      throw error;
    }
  }

  private getApiKey(): string {
    const apiKey = this.apiKeys[this.apiKeyCounter];
    this.apiKeyCounter = (this.apiKeyCounter + 1) % this.apiKeys.length;
    return apiKey;
  }
}
