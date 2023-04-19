
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApiClientModule } from 'src/infra/http/api-client/api-client.module';
import { AlphaVantageClientService } from './alphavantage.service';

@Module({
  imports: [ApiClientModule, HttpModule.register({})],
  providers: [AlphaVantageClientService],
  exports: [AlphaVantageClientService],
})
export class AlphaVantageClientModule {}