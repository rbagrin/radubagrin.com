import { Controller, Get, Param } from "@nestjs/common";
import { StockService } from "./stock.service";

@Controller('/api/stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('/:ticker')
  async exportAllAbsences(@Param('ticker') ticker: string): Promise<string> {
    return this.stockService.getStockData(ticker);
  }
}