import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/core/prisma/prisma.service';
import { createMainTaskDto } from './dto/create.main.task.dto';
import { CreateSubtasksDto } from './dto/create.sub.task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';
import { paginate } from 'src/core/utils/paginator';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';

@Injectable()
export class TaskService {
    constructor(private readonly prisma: PrismaService,) {}
  async createMainTask(dto: createMainTaskDto , userId: string) {
     return await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        priority: dto.priority,

        userId: userId,

      },
    });
  }
  async createSubtasks(dto: CreateSubtasksDto, userId: string) {
  const { parentId, subtasks } = dto;


  const parent = await this.prisma.task.findFirst({
    where: { id: parentId, userId: userId }
  });



  const dataToInsert = subtasks.map(sub => ({
    title: sub.title,
    description: sub.description,
    priority: sub.priority || parent!.priority,
    userId: userId,
    parentId: parentId
  }));


  return await this.prisma.task.createMany({
    data: dataToInsert
  });
  }
  async updateTask(taskId: string, dto: UpdateTaskDto, userId: string) {

    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        userId: userId
      }
    });
    return await this.prisma.task.update({
      where: { id: taskId },
      data: {

        ...dto
      }
    });
  }


  async getTasks(userId: string, query: GetTasksQueryDto) {
    const whereClause: any = { userId };

     if (query.parentId) {
       const parentTask = await this.prisma.task.findFirst({
        where: { id: query.parentId, userId },
      });

      if (!parentTask) {
        throw new NotFoundException('المهمة الأساسية غير موجودة أو لا تملك صلاحيتها');
      }

      whereClause.parentId = query.parentId;
    } else {

      whereClause.parentId = null;
    }


    if (query.status) whereClause.status = query.status;
    if (query.search) {
      whereClause.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }


    const includeObj = query.parentId ? undefined : { subtasks: true };

     return paginate(
      this.prisma.task,
      {
        where: whereClause,
        include: includeObj,
        orderBy: { createdAt: 'desc' }
      },
      query.page,
      query.limit
    );
  }
  async deleteTask(taskId: string, userId: string) {
     const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId: userId },
    });


      await this.prisma.task.deleteMany({
      where: { parentId: taskId, userId: userId },
    });


    await this.prisma.task.delete({
      where: { id: taskId },
    });


    return {
      success: true,
      message: 'تم حذف المهمة (ومهامها الفرعية) بنجاح',
    };
  }
}
