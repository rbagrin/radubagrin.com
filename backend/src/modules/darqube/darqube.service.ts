import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ApiClientService } from 'src/infra/http/api-client/api-client.service';
import {
  DarqubeBalanceSheetResponse,
  DarqubeCashFlowResponse,
  DarqubeEpsHistorical,
  DarqubeEpsTrends,
  DarqubeIncomeStatementResponse,
  DarqubeTickerMarketData,
  DarqubeTickerNews,
  DarqubeTickerTweet,
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
    interval: '1d',
  ): Promise<DarqubeTickerMarketData[]> {
    try {
      const start = Math.round(startDate / 1000);
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

  async getTickerCashFlow(ticker: Ticker): Promise<DarqubeCashFlowResponse> {
    try {
      const { data } = await this.httpService
        .get<DarqubeCashFlowResponse>(
          `/fundamentals/stocks/cash_flow/${ticker}?token=${this.apiKey}`,
        )
        .toPromise();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getTickerNews(ticker: Ticker): Promise<DarqubeTickerNews[]> {
    try {
      const { data } = await this.httpService
        .get<DarqubeTickerNews[]>(
          `/fundamentals/media/news?token=${this.apiKey}&symbol=${ticker}&skip=0&limit=100&sort=desc`,
        )
        .toPromise();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getTickerTweets(ticker: Ticker): Promise<DarqubeTickerTweet[]> {
    try {
      const { data } = await this.httpService
        .get<DarqubeTickerTweet[]>(
          `/fundamentals/media/tweets?token=${this.apiKey}&symbol=${ticker}&skip=0&limit=100&sort=desc`,
        )
        .toPromise();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getTickerEPSTrends(ticker: Ticker): Promise<DarqubeEpsTrends> {
    try {
      const { data } = await this.httpService
        .get<DarqubeEpsTrends>(
          `/fundamentals/stocks/eps_trends/${ticker}?token=${this.apiKey}`,
        )
        .toPromise();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getTickerEPSHistorical(ticker: Ticker): Promise<DarqubeEpsHistorical> {
    try {
      const { data } = await this.httpService
        .get<DarqubeEpsHistorical>(
          `/fundamentals/stocks/eps_historical/${ticker}?token=${this.apiKey}`,
        )
        .toPromise();
      return data;
    } catch (error) {
      throw error;
    }
  }
}
