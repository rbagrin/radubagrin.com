import { CustomerEntity } from './customer.entity';
import { ModelData } from '../../../infra/db/postgres/postgres-config/postgres.util';

export type Customer = ModelData<CustomerEntity>;

export type CreateCustomer = Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>;

export type CreateCustomerResponse = {
  customerId: string | null;
  chamberId: string | null;
  isClosest: boolean;
  success: boolean;
  customerMessage: string;
  chamberMessage: string;
  leftCapacity: number | null;
};
