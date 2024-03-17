import { Controller, Get } from '@nestjs/common';
import { FibreNetworkService } from './fibre-network.service';
import { CustomerEntity } from './customer/customer.entity';
import { ChamberEntity } from './chamber/chamber.entity';

@Controller('/fibre-network')
export class FibreNetworkController {
  constructor(private readonly fibreNetworkService: FibreNetworkService) {}

  @Get('/all')
  async getAll(): Promise<{
    customers: CustomerEntity[];
    chambers: ChamberEntity[];
  }> {
    return this.fibreNetworkService.findAllChambersAndCustomers();
  }
}
