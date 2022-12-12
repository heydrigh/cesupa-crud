import * as dotenv from 'dotenv';
import { cwd } from 'process';
import { DataSource, DataSourceOptions } from 'typeorm';
import { configurationService } from './config.service';

dotenv.config();

const typeOrmConfig = configurationService.getTypeOrmConfig(
  cwd(),
) as DataSourceOptions;

export const dataSource = new DataSource({ ...typeOrmConfig });
