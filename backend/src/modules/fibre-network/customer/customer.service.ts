import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CustomerEntity } from './customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(CustomerEntity)
    private customerRepository: typeof CustomerEntity,
  ) {}

  async findAll(): Promise<CustomerEntity[]> {
    return this.customerRepository.findAll<CustomerEntity>();
  }
}
