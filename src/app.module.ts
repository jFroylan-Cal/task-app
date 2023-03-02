import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { typeOrmDefault } from './database/database-config';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmDefault),TasksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
