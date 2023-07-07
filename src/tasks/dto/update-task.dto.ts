import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsBoolean } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsBoolean()
  finished: boolean;
}
