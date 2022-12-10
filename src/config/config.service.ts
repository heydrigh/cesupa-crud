import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  public getValue(key: string, defaultValue?: string): string {
    const value = this.env[key];
    if (value === undefined && defaultValue === undefined) {
      throw new Error(`config error - missing env.${key}`);
    }

    if (value === undefined) {
      return defaultValue || '';
    }

    return value;
  }

  public isTest() {
    const mode = this.getValue('NODE_ENV');
    return mode === 'test';
  }

  public isProduction() {
    const mode = this.getValue('NODE_ENV');
    return mode === 'production';
  }

  public isDevelopment() {
    return !this.isProduction();
  }

  public getTypeOrmConfig(rootDir: string): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT'), 10),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      schema: this.getValue('POSTGRES_SCHEMA'),
      migrationsTableName: 'migrations',
      autoLoadEntities: true,
      migrations: [
        join(rootDir, 'migration/*{.ts,.js}'),
        join(rootDir, 'src/migration/*{.ts,.js}'),
      ],
      synchronize: true,
    };
  }
}

const configService = new ConfigService(process.env);

export { configService };
