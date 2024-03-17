import * as Joi from 'joi';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import configuration from './postgres-config';
import { PostgresConfigService } from './postgres-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        PGHOST: Joi.string().required(),
        PGPORT: Joi.string().required(),
        PGUSER: Joi.string().required(),
        PGPASSWORD: Joi.string(),
        PGDATABASE: Joi.string().required(),
        PGENDPOINT_ID: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, PostgresConfigService],
  exports: [ConfigService, PostgresConfigService],
})
export class PostgresConfigModule {}
