import { Controller, Get, Param } from "@nestjs/common";
import { StockService } from "./stock.service";

@Controller('/api/stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('/:ticker/daily-adjusted')
  async getDailyAdjustedStockData(@Param('ticker') ticker: string): Promise<TimeSeriesDailyAdjustedResponse> {
    return this.stockService.getDailyAdjustedStockDataByTicker(ticker);
  }

  @Get('/:ticker/weekly-adjusted')
  async getWeeklyAdjustedStockData(@Param('ticker') ticker: string): Promise<TimeSeriesWeeklyAdjustedResponse> {
    return this.stockService.getWeeklyAdjustedStockDataByTicker(ticker);
  }

  @Get('/:ticker/montlhy-adjusted')
  async getMonthlyAdjustedStockData(@Param('ticker') ticker: string): Promise<TimeSeriesMonthlyAdjustedResponse> {
    return this.stockService.getMonthlyAdjustedStockDataByTicker(ticker);
  }
}