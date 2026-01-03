import '@timescaledb/typeorm';
import 'dotenv/config';
import { Observation } from 'src/observations/entities';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrations: [
    'dist/common/db/migrations/migrations/*.js',
    'dist/common/db/migrations/seeds/*.js',
  ],
  entities: [Observation],
  ssl: process.env.DB_SSL && {
    rejectUnauthorized: false,
  },
  namingStrategy: new SnakeNamingStrategy(),
  logging: true,
};

const dataSource = new DataSource(typeOrmConfig);
export default dataSource;
