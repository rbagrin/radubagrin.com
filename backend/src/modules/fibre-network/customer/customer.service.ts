import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CustomerEntity } from './customer.entity';
import {
  CreateCustomer,
  CreateCustomerResponse,
  Customer,
} from './customer.interface';
import {
  toDomain,
  toDomainArray,
} from '../../../infra/db/postgres/postgres-config/postgres.util';
import { ChamberService } from '../chamber/chamber.service';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(CustomerEntity)
    private customerRepository: typeof CustomerEntity,
    private chamberService: ChamberService,
    private sequelizeService: Sequelize,
  ) {}

  async findAll(): Promise<Customer[]> {
    const customers = await this.customerRepository.findAll<CustomerEntity>();
    return toDomainArray(customers);
  }

  async createCustomer(data: CreateCustomer): Promise<CreateCustomerResponse> {
    // Get closest chamber details
    const chamberResult = await this.chamberService.getClosestChamberAvailable(
      data.capacity,
      data.latitude,
      data.longitude,
    );

    if (!chamberResult.success || !chamberResult.chamberId)
      return {
        customerId: null,
        chamberId: null,
        isClosest: false,
        success: false,
        customerMessage: 'Customer has not been created.',
        chamberMessage: chamberResult.message,
        leftCapacity: null,
      };

    const transaction = await this.sequelizeService.transaction();
    try {
      const newCustomer = await this.createDBCustomer(
        {
          ...data,
          chamberId: chamberResult.chamberId,
        },
        transaction,
      );

      const updatedChamber =
        await this.chamberService.updateChamberUsedCapacityById(
          chamberResult.chamberId,
          data.capacity,
          transaction,
        );

      if (!updatedChamber)
        throw new NotFoundException(
          'Something went wrong. No chamber has been updated.',
        );

      await transaction.commit();

      return {
        customerId: newCustomer.id,
        chamberId: chamberResult.chamberId,
        isClosest: chamberResult.isClosest,
        success: true,
        customerMessage: 'Customer created successfully',
        chamberMessage: chamberResult.message,
        leftCapacity:
          updatedChamber.totalCapacity - updatedChamber.usedCapacity,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private async createDBCustomer(
    data: CreateCustomer,
    transaction: Transaction,
  ): Promise<Customer> {
    const customer = await this.customerRepository.create(
      {
        name: data.name,
        address: data.address,
        postcode: data.postcode,
        latitude: data.latitude,
        longitude: data.longitude,
        geom: {
          coordinates: [data.latitude, data.longitude],
          type: 'Point',
        },
        chamberId: data.chamberId,
        capacity: data.capacity,
      } as CreateCustomer,
      {
        transaction,
        returning: true,
      },
    );

    return toDomain(customer);
  }
}
