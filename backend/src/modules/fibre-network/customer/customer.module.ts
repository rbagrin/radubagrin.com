import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CustomerService } from './customer.service';
import { CustomerEntity } from './customer.entity';
import { ChamberModule } from '../chamber/chamber.module';

@Module({
  imports: [SequelizeModule.forFeature([CustomerEntity]), ChamberModule],
  providers: [CustomerService],
  exports: [CustomerService],
  controllers: [],
})
export class CustomerModule {}
