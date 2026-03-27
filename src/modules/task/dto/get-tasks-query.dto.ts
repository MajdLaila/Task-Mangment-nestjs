
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsEnum, IsInt, Min, IsDateString } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class GetTasksQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

   @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsDateString({}, { message: 'يجب إدخال تاريخ صالح (مثال: 2026-03-25)' })
  date?: string;
}
