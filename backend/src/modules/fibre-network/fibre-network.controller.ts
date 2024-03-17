import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { CustomerService } from './customer/customer.service';
import { ChamberService } from './chamber/chamber.service';
import { Customer } from './customer/customer.interface';
import { Chamber } from './chamber/chamber.interface';
import { CreateCustomerDto } from './customer/dto/create-customer.dto';
import { ResponseInterceptor } from '../../infra/interceptors/response.interceptor';
import { CustomerDto } from './customer/dto/customer.dto';
import { ChamberDto } from './chamber/dto/chamber.dto';

@Controller('/api/fibre-network')
export class FibreNetworkController {
  constructor(
    private customerService: CustomerService,
    private chamberService: ChamberService,
  ) {}

  @Get('/chambers')
  @UseInterceptors(new ResponseInterceptor(ChamberDto))
  async getAllChambers(): Promise<Chamber[]> {
    return this.chamberService.findAll();
  }

  @Get('/customers')
  @UseInterceptors(new ResponseInterceptor(CustomerDto))
  async getAllCustomers(): Promise<Customer[]> {
    return this.customerService.findAll();
  }

  @Post('/customers')
  // TODO: Validate input
  async createCustomer(@Body() data: CreateCustomerDto): Promise<void> {
    await this.customerService.createCustomer(data);
  }
}
