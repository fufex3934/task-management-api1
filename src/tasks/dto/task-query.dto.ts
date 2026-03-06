import { IsOptional, IsInt, IsBooleanString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class TaskQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;

  @IsOptional()
  @IsBooleanString()
  completed?: string;

  @IsOptional()
  @Type(() => Number)
  priority?: number;

  @IsOptional()
  @IsIn(['createdAt', 'priority'])
  sortBy?: 'createdAt' | 'priority';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
