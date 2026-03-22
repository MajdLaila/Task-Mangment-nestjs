import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength, minLength } from "class-validator";
import { TaskPriority, TaskStatus } from '@prisma/client';
export class createMainTaskDto {
@IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskPriority) // التأكد أن الأولوية ضمن القيم المسموحة
  priority?: TaskPriority;
  @IsEnum(TaskStatus)
  status?: TaskStatus;


}
