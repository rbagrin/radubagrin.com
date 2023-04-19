
import { Module } from '@nestjs/common';
import { ApiClientService } from './api-client.service';
import { HttpModule } from './http.module';

@Module({
  imports: [HttpModule],
  providers: [ApiClientService],
  exports: [ApiClientService],
})
export class ApiClientModule {}