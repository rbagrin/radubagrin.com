import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ApiClientService } from 'src/infra/http/api-client/api-client.service';
import {
  DarqubeBalanceSheetResponse,
  DarqubeIncomeStatementResponse,
  DarqubeTickerMarketData,
} from './darqube.interface';
import { Ticker } from '../stock/stock.interace';

@Injectable()
export class DarqubeClientService extends ApiClientService {
  logger = new Logger('Darqube API Client');

  private apiKey = '';

  constructor(public httpService: HttpService) {
    super(httpService);
    this.setApiClient('https://api.darqube.com/data-api');
    this.setHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    this.apiKey = process.env.DARQUBE_API_KEY;
  }

  async getTicketMarketData(
    ticker: Ticker,
    startDate: number,
    endDate: number,
    interval: '1d',
  ): Promise<DarqubeTickerMarketData[]> {
    try {
      const start = Math.round(new Date('2023-01-01').getTime() / 1000);
      const end = Math.round(Date.now() / 1000);
      const { data } = await this.httpService
        .get<DarqubeTickerMarketData[]>(
          `/market_data/historical/${ticker}?token=${this.apiKey}&start_date=${start}&end_date=${end}&interval=${interval}`,
        )
        .toPromise();
      return data;
    } catch (error) {
      throw error;
    }
  }
  async getTickerBalanceSheet(
    ticker: Ticker,
  ): Promise<DarqubeBalanceSheetResponse> {
    try {
      const { data } = await this.httpService
        .get<DarqubeBalanceSheetResponse>(
          `/fundamentals/stocks/balance_sheet/${ticker}?token=${this.apiKey}`,
        )
        .toPromise();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getTickerIncomeStatement(
    ticker: Ticker,
  ): Promise<DarqubeIncomeStatementResponse> {
    try {
      const { data } = await this.httpService
        .get<DarqubeIncomeStatementResponse>(
          `/fundamentals/stocks/income_statement/${ticker}?token=${this.apiKey}`,
        )
        .toPromise();
      return data;
    } catch (error) {
      throw error;
    }
  }
}
