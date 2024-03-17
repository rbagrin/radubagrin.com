import { Module } from '@nestjs/common';
import { CustomerModule } from './customer/customer.module';
import { ChamberModule } from './chamber/chamber.module';
import { FibreNetworkController } from './fibre-network.controller';

@Module({
  imports: [CustomerModule, ChamberModule],
  providers: [],
  exports: [],
  controllers: [FibreNetworkController],
})
export class FibreNetworkModule {}
