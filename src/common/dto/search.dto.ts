import { IsBoolean, IsEnum, IsOptional, IsString, Matches, Min } from 'class-validator';
import { Status } from '../enums/status.enum';

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

  @IsOptional()
  @IsEnum(Status)
  status: Status;

  @IsOptional()
  @IsBoolean()
  watched: boolean;
}
