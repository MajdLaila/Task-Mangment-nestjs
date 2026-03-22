import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskPriority, TaskStatus } from '@prisma/client';

 class SubtaskItemDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskPriority)
   priority?: TaskPriority;

     @IsEnum(TaskStatus)
     status?: TaskStatus;
}


 export class CreateSubtasksDto {
  @IsNotEmpty()
  @IsUUID()
  parentId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubtaskItemDto) //
  subtasks: SubtaskItemDto[];
}
