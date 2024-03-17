import { Module } from '@nestjs/common';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { ChamberEntity } from '../../../modules/fibre-network/chamber/chamber.entity';
import { PostgresConfigService } from './postgres-config/postgres-config.service';
import { PostgresConfigModule } from './postgres-config/postgres-config.module';

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
        // logging(sql: string, executionTime: number) {
        //   const sqlLength = sql.length;
        //   // truncate large queries before logging
        //   const loggedSql =
        //     sqlLength > 1024
        //       ? `${sql.slice(0, 500)} ... ${sql.slice(-500)}`
        //       : sql;
        //   console.debug(
        //     loggedSql,
        //     // if benchmark is false, the second parameter to this logging function is a class definition, (not a number or undefined)
        //     benchmark
        //       ? { executionTime, sqlLength, idx: (sqlidx += 1) }
        //       : undefined,
        //   );
        // },
        models: [ChamberEntity],
      }),
      inject: [PostgresConfigService],
    } as SequelizeModuleOptions),
  ],
})
export class PostgresDatabaseProviderModule {}
