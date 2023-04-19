import { Injectable, Logger } from "@nestjs/common";
import { AlphaVantageClientService } from "../alphavantage/alphavantage.service";

@Injectable()
export class StockService {
  private logger = new Logger(StockService.name);

  constructor(
    private readonly alphaVantageClientService: AlphaVantageClientService
  ) {
    console.log('set')
  }

  public async getStockData(ticker: string): Promise<any> {
    return this.alphaVantageClientService.getTickerData(ticker);
  }
}