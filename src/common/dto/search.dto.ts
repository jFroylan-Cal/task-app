import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { Status } from '../enums/status.enum';

export class SearchDto {
  @IsString()
  @Min(1)
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  @Matches(/^(\d{3,4})[/](\d{1,2})[/](\d{1,2})$/, {
    message: 'The date must have yyyy/mm/dd pattern',
  })
  created?: string;

  @IsString()
  @IsOptional()
  @Matches(/^(\d{3,4})[/](\d{1,2})[/](\d{1,2})$/, {
    message: 'The date must have yyyy/mm/dd pattern',
  })
  finished?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsBoolean()
  watched?: boolean;
}
