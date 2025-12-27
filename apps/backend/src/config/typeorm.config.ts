import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

config();

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'pictionary_user',
  password: process.env.DATABASE_PASSWORD || 'pictionary_password',
  database: process.env.DATABASE_NAME || 'pictionary_db',
  entities: [path.join(process.cwd(), 'src', '**', '*.entity{.ts,.js}')],
  migrations: [path.join(process.cwd(), 'src', 'migrations', '*{.ts,.js}')],
  synchronize: false, // Siempre false en producción, usar migraciones
  logging: process.env.NODE_ENV === 'development',
};

const dataSource = new DataSource(typeOrmConfig);

export default dataSource;
