import { IsBoolean, IsEnum, IsOptional, IsString, Matches, Min } from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';

export class SearchDto {
  @IsString()
  @Min(1)
  @IsOptional()
  name?: string;

  @IsString()
  @Min(1)
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @Matches(/^(\d{1,2})[/](\d{1,2})[/](\d{3,4})$/, {
    message: 'The date must have dd/mm/yyyy pattern',
  })
  created: string;

  @IsString()
  @IsOptional()
  @Matches(/^(\d{1,2})[/](\d{1,2})[/](\d{3,4})$/, {
    message: 'The date must have dd/mm/yyyy pattern',
  })
  finished: string;

  //TODO Add fromDate and toDate

  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsBoolean()
  watched: boolean;
}
