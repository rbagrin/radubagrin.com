import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CustomerService } from './customer.service';
import { CustomerEntity } from './customer.entity';

@Module({
  imports: [SequelizeModule.forFeature([CustomerEntity])],
  providers: [CustomerService],
  exports: [CustomerService],
  controllers: [],
})
export class CustomerModule {}
