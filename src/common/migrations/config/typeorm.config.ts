import * as dotenv from 'dotenv';
dotenv.config({
  path: ['.env.development.local', '.env.development', '.env'],
});
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  migrations: [
    'dist/common/migrations/migrations/*.js',
    'dist/common/migrations/seeds/*.js',
  ],
  entities: ['dist/**/*.entity.js'],
  ssl: process.env.DATABASE_SSL === 'true' && {
    rejectUnauthorized: false,
  },
  namingStrategy: new SnakeNamingStrategy(),
};

const dataSource = new DataSource(typeOrmConfig);
export default dataSource;
