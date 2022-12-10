import * as dotenv from 'dotenv';
import { cwd } from 'process';
import { DataSource, DataSourceOptions } from 'typeorm';
import { configService } from './config.service';

dotenv.config();

const typeOrmConfig = configService.getTypeOrmConfig(
  cwd(),
) as DataSourceOptions;

export const dataSource = new DataSource({ ...typeOrmConfig });
