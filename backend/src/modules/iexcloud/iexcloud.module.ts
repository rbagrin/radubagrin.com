import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApiClientModule } from 'src/infra/http/api-client/api-client.module';
import { IEXCloudClientService } from './iexcloud.service';

@Module({
  imports: [ApiClientModule, HttpModule.register({})],
  providers: [IEXCloudClientService],
  exports: [IEXCloudClientService],
})
export class IEXCloudClientModule {}
