import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmDefault: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgrespw',
  database: 'task-app',
  autoLoadEntities: true,
  logging: 'all',
  synchronize: true,
  entities: [],
};
