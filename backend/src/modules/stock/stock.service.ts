import { Injectable, Logger } from "@nestjs/common";
import { AlphaVantageClientService } from "../alphavantage/alphavantage.service";

@Injectable()
export class StockService {
  private logger = new Logger(StockService.name);

  constructor(
    private readonly alphaVantageClientService: AlphaVantageClientService
  ) {}
  
  public async getDailyAdjustedStockDataByTicker(ticker: string): Promise<TimeSeriesDailyAdjustedResponse> {
    return this.alphaVantageClientService.getTickerTimeSeriesDailyAdjustedData(ticker);
  }
  
  public async getWeeklyAdjustedStockDataByTicker(ticker: string): Promise<TimeSeriesWeeklyAdjustedResponse> {
    return this.alphaVantageClientService.getTickerTimeSerieWeeklyAdjustedData(ticker);
  }

  public async getMonthlyAdjustedStockDataByTicker(ticker: string): Promise<TimeSeriesMonthlyAdjustedResponse> {
    return this.alphaVantageClientService.getTickerTimeSerieMonthlyAdjustedData(ticker);
  }
}