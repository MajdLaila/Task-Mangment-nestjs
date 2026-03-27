import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/core/prisma/prisma.service';
import { createMainTaskDto } from './dto/create.main.task.dto';
import { CreateSubtasksDto } from './dto/create.sub.task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';
import { paginate } from 'src/core/utils/paginator';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';
import { TasksRepository } from './task.repository';

@Injectable()
export class TaskService {
constructor(private readonly tasksRepo: TasksRepository) {}
  async createMainTask(dto: createMainTaskDto , userId: string) {
return await this.tasksRepo.create({
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      status: dto.status,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null, // تحويل التاريخ من string إلى Date
      userId: userId,
    });
  }
  async createSubtasks(dto: CreateSubtasksDto, userId: string) {
  const { parentId, subtasks } = dto;


const parent = await this.tasksRepo.findByIdAndUser(parentId, userId);


const dataToInsert = subtasks.map(sub => ({
      title: sub.title,
      description: sub.description,
      priority: sub.priority || parent!.priority, // إذا لم تحدد أولوية، تأخذ أولوية الأب
      dueDate: sub.dueDate ? new Date(sub.dueDate) : null,
      userId: userId,
      parentId: parentId
    }));

    return await this.tasksRepo.createMany(dataToInsert);



  }
  async updateTask(taskId: string, dto: UpdateTaskDto, userId: string) {

 const task = await this.tasksRepo.findByIdAndUser(taskId, userId);
const updateData = { ...dto };
    if (dto.dueDate) {
      (updateData as any).dueDate = new Date(dto.dueDate);
    }

    return await this.tasksRepo.update(taskId, updateData);
  }


async getTasks(userId: string, query: GetTasksQueryDto) {
    // ----------------------------------------------------------------------
    // 1. بناء فلتر البحث الخاص بقائمة المهام (List Filter)
    // ----------------------------------------------------------------------
    const listWhereClause: any = { userId };

    // معالجة فلتر التاريخ (فقط إذا طلب المستخدم عرض مهام تاريخ محدد)
    if (query.date) {
      const targetDate = new Date(query.date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

      listWhereClause.dueDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    // معالجة المهام الرئيسية والفرعية
    if (query.parentId) {
      const parentExists = await this.tasksRepo.findByIdAndUser(query.parentId, userId);
      if (!parentExists) {
        throw new NotFoundException('المهمة الأساسية غير موجودة أو لا تملك صلاحيتها');
      }
      listWhereClause.parentId = query.parentId;
    } else {
      listWhereClause.parentId = null; // عرض المهام الرئيسية فقط
    }

    // فلاتر الحالة والبحث النصي
    if (query.status) listWhereClause.status = query.status;
    if (query.search) {
      listWhereClause.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }

    // ----------------------------------------------------------------------
    // 2. بناء فلتر الإحصائيات (Stats Filter) النظيف
    // (يعتمد فقط على المستخدم ومستوى المهمة، ولا يتأثر بالتاريخ أو حالة البحث)
    // ----------------------------------------------------------------------
    const statsWhereClause = {
      userId,
      parentId: query.parentId || null,
    };

    // ----------------------------------------------------------------------
    // 3. التنفيذ المتوازي (Parallel Execution) لأقصى سرعة
    // ----------------------------------------------------------------------
    const includeObj = query.parentId ? undefined : { subtasks: true };
    const delegate = this.tasksRepo.getTaskDelegate();

    const [paginatedResult, totalTasks, completedTasks] = await Promise.all([
      // جلب المهام بناءً على فلاتر البحث والتواريخ
      paginate(
        delegate,
        {
          where: listWhereClause,
          include: includeObj,
          orderBy: { createdAt: 'desc' }
        },
        query.page,
        query.limit
      ),
      // إحصائية: كل المهام الخاصة بهذا المستخدم (في هذا المستوى)
      delegate.count({ where: statsWhereClause }),
      // إحصائية: المهام المكتملة فقط
      delegate.count({ where: { ...statsWhereClause, status: 'DONE' } })
    ]);

    // ----------------------------------------------------------------------
    // 4. حساب النسبة المئوية وتجهيز النتيجة
    // ----------------------------------------------------------------------
    const completionPercentage = totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

    return {
      totalTasks,            // تم التصحيح (كانت مكتوبة totalTasksToday بالغلط)
      completedTasks,
      completionPercentage,
      ...paginatedResult,    // دمج بيانات الصفحات والمهام
    };
  }
  async deleteTask(taskId: string, userId: string) {
const task = await this.tasksRepo.findByIdAndUser(taskId, userId);
    if (!task) {
      throw new NotFoundException('المهمة غير موجودة أو لا تملك صلاحية حذفها');
    }

    await this.tasksRepo.delete(taskId);

    return {
      success: true,
      message: 'تم حذف المهمة بنجاح',
    };

  }
}
