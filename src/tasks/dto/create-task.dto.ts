import { IsEnum, IsString, MinLength } from 'class-validator';
import { Status } from '../../common/enums/status.enum';

export class CreateTaskDto {
  @IsString()
  @MinLength(3)
  description: string;

  @IsEnum(Status)
  status: Status;
}
