import axios from "axios";
import {
  DarqubeBalanceSheetResponse,
  DarqubeIncomeStatementResponse,
  DarqubeTickerMarketData,
  NewsFeedItem,
  NewsResponse,
  Ticker,
  TimeSeriesDailyAdjustedResponse,
  TimeSeriesMonthlyAdjustedResponse,
  TimeSeriesWeeklyAdjustedResponse,
} from "../types/stock.type";

export class StockAPI {
  static async getStocks(): Promise<any> {
    return (await axios.get(`/api/stocks`)).data;
  }

  static async getDailyAdjustedDataByTicker(
    ticker: string
  ): Promise<TimeSeriesDailyAdjustedResponse> {
    return (await axios.get(`/api/stocks/${ticker}/daily-adjusted`)).data;
  }

  static async getDailyDataBySticker(
    ticker: Ticker
  ): Promise<DarqubeTickerMarketData[]> {
    const daysAgo = new Date();
    daysAgo.setDate(-90);
    const start = daysAgo.getTime();
    const end = Date.now();
    const interval = "1d";
    return (
      await axios.get(
        `/api/stocks/${ticker}/market-data?startDate=${start}&endDate=${end}&interval=${interval}`
      )
    ).data;
  }
  static async getStockIncomeStatement(
    ticker: Ticker
  ): Promise<DarqubeIncomeStatementResponse> {
    // Darqube
    return (await axios.get(`/api/stocks/${ticker}/income-statement`)).data;
  }

  static async getStockBalanceSheet(
    ticker: Ticker
  ): Promise<DarqubeBalanceSheetResponse> {
    // Darqube
    return (await axios.get(`/api/stocks/${ticker}/balance-sheet`)).data;
  }

  static async getWeeklyAdjustedDataByTicker(
    ticker: string
  ): Promise<TimeSeriesWeeklyAdjustedResponse> {
    return (await axios.get(`/api/stocks/${ticker}/weekly-adjusted`)).data;
  }

  static async getMonthlyAdjustedDataByTicker(
    ticker: string
  ): Promise<TimeSeriesMonthlyAdjustedResponse> {
    return (await axios.get(`/api/stocks/${ticker}/monthly-adjusted`)).data;
  }

  static async getStockNewsByTicker(ticker: string): Promise<NewsFeedItem[]> {
    const res = (await axios.get<NewsResponse>(`/api/stocks/${ticker}/news`))
      .data;
    return res?.feed?.filter((item) =>
      item.ticker_sentiment.some((ts) => ts.ticker === ticker)
    );
  }
}
