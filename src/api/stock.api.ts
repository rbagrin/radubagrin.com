import axios from "axios";
import {
  DarqubeBalanceSheetResponse,
  DarqubeIncomeStatementResponse,
  DarqubeTickerMarketData,
  TickerNewsItem,
  Ticker,
  TimeSeriesDailyAdjustedResponse,
  TimeSeriesMonthlyAdjustedResponse,
  TimeSeriesWeeklyAdjustedResponse,
  DBStock,
  DarqubeCashFlowResponse,
  AlphavantageOverviewResponse,
} from "../types/stock.type";

export class StockAPI {
  static async getDBStocks(): Promise<DBStock[]> {
    return (await axios.get(`/api/stocks`)).data;
  }

  static async deleteDBStocks(id: string): Promise<void> {
    await axios.delete(`/api/stocks/${id}`);
  }

  static async addDBStocks(ticker: Ticker, name: string): Promise<void> {
    await axios.post("/api/stocks", { name, ticker });
  }

  static async getCompanyOverviewByTicker(
    ticker: string
  ): Promise<AlphavantageOverviewResponse> {
    // alphavantage
    return (await axios.get(`/api/stocks/${ticker}/company-overview`)).data;
  }

  static async getDailyAdjustedDataByTicker(
    ticker: string
  ): Promise<TimeSeriesDailyAdjustedResponse> {
    return (await axios.get(`/api/stocks/${ticker}/daily-adjusted`)).data;
  }

  static async getDailyDataByTicker(
    ticker: Ticker
  ): Promise<DarqubeTickerMarketData[]> {
    const daysAgo = new Date();
    daysAgo.setFullYear(new Date().getFullYear() - 5);
    const start = daysAgo.getTime();
    const interval = "1d";
    return (
      await axios.get(
        `/api/stocks/${ticker}/market-data?startDate=${start}&interval=${interval}`
      )
    ).data;
  }

  static async getWeeklyDataByTicker(
    ticker: Ticker
  ): Promise<DarqubeTickerMarketData[]> {
    const daysAgo = new Date();
    daysAgo.setFullYear(-1);
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

  static async getStockCashFlow(
    ticker: Ticker
  ): Promise<DarqubeCashFlowResponse> {
    // Darqube
    return (await axios.get(`/api/stocks/${ticker}/cash-flow`)).data;
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

  static async getStockNewsByTicker(ticker: string): Promise<TickerNewsItem[]> {
    return (await axios.get<TickerNewsItem[]>(`/api/stocks/${ticker}/news`))
      .data;
  }
}
