import { IsEnum, IsString, MinLength } from 'class-validator';
import { Status } from '../../common/enums/status.enum';

export class CreateProjectDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(2)
  projectType: string;

  @IsEnum(Status)
  status: Status;
}
