import { Module } from '@nestjs/common';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { ChamberEntity } from '../../../modules/fibre-network/chamber/chamber.entity';
import { PostgresConfigService } from './postgres-config/postgres-config.service';
import { PostgresConfigModule } from './postgres-config/postgres-config.module';
import { CustomerEntity } from '../../../modules/fibre-network/customer/customer.entity';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [PostgresConfigModule],
      useFactory: async (postgresConfigService: PostgresConfigService) => ({
        dialect: 'postgres',
        host: postgresConfigService.host,
        port: postgresConfigService.port,
        username: postgresConfigService.username,
        password: postgresConfigService.password,
        database: postgresConfigService.database,
        dialectOptions: {
          project: postgresConfigService.endpointId,
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
        pool: {
          max: 5,
          min: 5,
          acquire: 5000,
          idle: 60_000,
        },
        logging: console.log,
        models: [ChamberEntity, CustomerEntity],
      }),
      inject: [PostgresConfigService],
    } as SequelizeModuleOptions),
  ],
})
export class PostgresDatabaseProviderModule {}
