import { IsDateString, IsEnum, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { TaskPriority, TaskStatus } from '@prisma/client';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;
@IsOptional()
  @IsDateString({}, { message: 'يجب إدخال تاريخ صالح (ISO8601)' })
  dueDate?: string;
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
        @IsOptional()
  @IsUUID()
  parentId: string;
}
