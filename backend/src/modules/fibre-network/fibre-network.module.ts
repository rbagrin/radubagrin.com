import { Module } from '@nestjs/common';
import { CustomerModule } from './customer/customer.module';
import { ChamberModule } from './chamber/chamber.module';
import { FibreNetworkService } from './fibre-network.service';
import { FibreNetworkController } from './fibre-network.controller';

@Module({
  imports: [CustomerModule, ChamberModule],
  providers: [FibreNetworkService],
  exports: [],
  controllers: [FibreNetworkController],
})
export class FibreNetworkModule {}
