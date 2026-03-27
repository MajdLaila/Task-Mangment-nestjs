import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TasksRepository } from './task.repository';

@Module({
  imports: [PrismaModule],
  controllers: [TaskController],
  providers: [TaskService , TasksRepository],
})
export class TaskModule {}
