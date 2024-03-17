import { Injectable } from '@nestjs/common';
import { ChamberEntity } from './chamber/chamber.entity';
import { CustomerService } from './customer/customer.service';
import { ChamberService } from './chamber/chamber.service';
import { CustomerEntity } from './customer/customer.entity';

@Injectable()
export class FibreNetworkService {
  constructor(
    private customerService: CustomerService,
    private chamberService: ChamberService,
  ) {}

  async findAllChambersAndCustomers(): Promise<{
    customers: CustomerEntity[];
    chambers: ChamberEntity[];
  }> {
    const customers = await this.customerService.findAll();
    const chambers = await this.chamberService.findAll();
    return { customers, chambers };
  }
}
