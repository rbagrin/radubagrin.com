import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ApiClientService } from 'src/infra/http/api-client/api-client.service';

@Injectable()
export class AlphaVantageClientService extends ApiClientService {
  logger = new Logger('Hexnode API Client');

  constructor(public httpService: HttpService) {
    super(httpService);
    // Both baseUrl and paths should finish in '/' !
    this.setApiClient(`https://www.alphavantage.co`);
    this.setHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
  }

  async getTickerData(
    ticker: string,
    functionName: string = 'TIME_SERIES_DAILY_ADJUSTED',
  ): Promise<any> {
    try {
      const { data } = await this.httpService
        .get<any>(
          `/query?function=${functionName}&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
        )
        .toPromise();

      return data['Time Series (Daily)'];
      console.log(data);
      const rows = data
        .trim()
        .split('\n')
        .map((row) => row.trim());
      const keys = rows[0].split(',');
      const objects = [];
      for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(',');
        const obj = {};
        for (let j = 0; j < keys.length; j++) {
          obj[keys[j]] = values[j];
        }
        objects.push(obj);
      }

      return objects;
    } catch (error) {
      throw error;
    }
  }
}
