import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ApiClientService } from "src/infra/http/api-client/api-client.service";

const API_KEY = 'UC8183VP0K9OM9QX';

@Injectable()
export class AlphaVantageClientService extends ApiClientService {
  logger = new Logger('Hexnode API Client');

  constructor(public httpService: HttpService) {

    super(httpService);
    // Both baseUrl and paths should finish in '/' !
    this.setApiClient(`https://www.alphavantage.co`);
    this.setHeaders({ 'User-Agent': 'request', accept: 'application/json' })
  }

  async getTickerData(ticker: string, functionName: string = 'TIME_SERIES_INTRADAY_EXTENDED'): Promise<any> {
    try {
      const { data } = await this.httpService.get<any>(`/query?function=${functionName}&symbol=${ticker}&interval=5min&apikey=${API_KEY}`).toPromise();
      return data;
    } catch (error) {
      throw error;
    }
  }
}