import axios from "axios";
import {
  IEXCloudBalanceSheet,
  IEXCloudHistoricalData,
  IEXCloudIncomeStatement,
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
  ): Promise<IEXCloudHistoricalData[]> {
    // IEXCLOUD
    return (await axios.get(`/api/stocks/${ticker}/daily-data`)).data;
  }
  static async getStockIncomeStatement(
    ticker: Ticker,
    frequency: "quarterly" | "annual" = "quarterly",
    last = 4
  ): Promise<IEXCloudIncomeStatement[]> {
    // IEXCLOUD
    return (
      await axios.get(
        `/api/stocks/${ticker}/income-statement?frequency=${frequency}&last=${last}`
      )
    ).data;
  }

  static async getStockBalanceSheet(
    ticker: Ticker,
    frequency: "quarterly" | "annual" = "quarterly",
    last = 4
  ): Promise<IEXCloudBalanceSheet[]> {
    // IEXCLOUD
    return (
      await axios.get(
        `/api/stocks/${ticker}/balance-sheet?frequency=${frequency}&last=${last}`
      )
    ).data;
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
