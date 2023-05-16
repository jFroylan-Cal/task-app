import { IsString, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(2)
  projectType: string;
}
