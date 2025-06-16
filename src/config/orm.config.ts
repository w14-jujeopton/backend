import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getOrmConfig = (config: ConfigService): TypeOrmModuleOptions => {
  const dbType = config.get<'mysql' | 'sqlite'>('DB_TYPE');

  if (dbType === 'sqlite') {
    return {
      type: 'sqlite',
      database: config.get<string>('DB_PATH'),
      synchronize: config.get('DB_SYNC') === 'true',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    };
  }

  return {
    type: 'mysql',
    host: config.get<string>('DB_HOST'),
    port: config.get<number>('DB_PORT'),
    username: config.get<string>('DB_USERNAME'),
    password: config.get<string>('DB_PASSWORD'),
    database: config.get<string>('DB_NAME'),
    synchronize: config.get('DB_SYNC') === 'true',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  };
};
