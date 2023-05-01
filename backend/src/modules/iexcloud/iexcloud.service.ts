import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ApiClientService } from 'src/infra/http/api-client/api-client.service';
import {
  IEXCloudBalanceSheet,
  IEXCloudHistoricalData,
  IEXCloudIncomeStatement,
} from './iexcloud.interface';
import { Ticker } from '../stock/stock.interace';

@Injectable()
export class IEXCloudClientService extends ApiClientService {
  logger = new Logger('IEXCLOUD API Client');

  private apiKey = '';

  constructor(public httpService: HttpService) {
    super(httpService);
    this.setApiClient('https://api.iex.cloud/v1');
    this.setHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    this.apiKey = process.env.IEXCLOUD_TOKEN;
  }

  async getTickerHistoricalData(
    ticker: Ticker,
    range = '3m',
  ): Promise<IEXCloudHistoricalData[]> {
    try {
      const { data } = await this.httpService
        .get<IEXCloudHistoricalData[]>(
          `/data/CORE/HISTORICAL_PRICES/${ticker}?range=${range}&token=${this.apiKey}`,
        )
        .toPromise();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getTickerIncomeStatement(
    ticker: Ticker,
    frequency: 'quarterly' | 'annual' = 'quarterly',
    last = 4,
  ): Promise<IEXCloudIncomeStatement[]> {
    try {
      const { data } = await this.httpService
        .get<IEXCloudIncomeStatement[]>(
          `/data/CORE/INCOME/${ticker}/${frequency}?last=${last}&token=${this.apiKey}`,
        )
        .toPromise();
      return data;
    } catch (error) {
      throw error;
    }
  }
  async getTickerBalanceSheet(
    ticker: Ticker,
    frequency: 'quarterly' | 'annual' = 'quarterly',
    last = 4,
  ): Promise<IEXCloudBalanceSheet[]> {
    try {
      const { data } = await this.httpService
        .get<IEXCloudBalanceSheet[]>(
          `/data/core/balance_sheet/${ticker}/${frequency}?last=${last}&token=${this.apiKey}`,
        )
        .toPromise();
      return data;
    } catch (error) {
      throw error;
    }
  }
}
