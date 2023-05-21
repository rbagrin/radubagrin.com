import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApiClientModule } from 'src/infra/http/api-client/api-client.module';
import { DarqubeClientService } from './darqube.service';

@Module({
  imports: [ApiClientModule, HttpModule.register({})],
  providers: [DarqubeClientService],
  exports: [DarqubeClientService],
})
export class DarqubeClientModule {}
