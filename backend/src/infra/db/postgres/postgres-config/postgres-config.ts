import { registerAs } from '@nestjs/config';

export default registerAs('postgres', () => ({
  dialect: 'postgres',
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD || '',
  database: process.env.PGDATABASE,
  dialectOptions: {
    project: process.env.PGENDPOINT_ID,
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
}));
