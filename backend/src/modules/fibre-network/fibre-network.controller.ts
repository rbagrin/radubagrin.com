import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { CustomerService } from './customer/customer.service';
import { ChamberService } from './chamber/chamber.service';
import {
  CreateCustomerResponse,
  Customer,
} from './customer/customer.interface';
import { Chamber } from './chamber/chamber.interface';
import { CreateCustomerDto } from './customer/dto/create-customer.dto';
import { ResponseInterceptor } from '../../infra/interceptors/response.interceptor';
import { CustomerDto } from './customer/dto/customer.dto';
import { ChamberDto } from './chamber/dto/chamber.dto';
import { validateInput } from '../../infra/validation/validation.util';
import { CreateCustomerSchema } from './customer/customer.util';

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
  async createCustomer(
    @Body() data: CreateCustomerDto,
  ): Promise<CreateCustomerResponse> {
    await validateInput(data, CreateCustomerSchema);

    return this.customerService.createCustomer(data);
  }
}
