import { Injectable } from "@nestjs/common";
import { Prisma, Task } from "@prisma/client";
import { PrismaService } from "src/core/prisma/prisma.service";



@Injectable()
export class TasksRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.TaskUncheckedCreateInput): Promise<Task> {
    return this.prisma.task.create({ data });
  }

  async createMany(data: Prisma.TaskCreateManyInput[]): Promise<Prisma.BatchPayload> {
    return this.prisma.task.createMany({ data });
  }

  async findByIdAndUser(id: string, userId: string): Promise<Task | null> {
    return this.prisma.task.findFirst({ where: { id, userId } });
  }

  async update(id: string, data: Prisma.TaskUpdateInput): Promise<Task> {
    return this.prisma.task.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Task> {
    return this.prisma.task.delete({ where: { id } });
  }

  async deleteSubtasks(parentId: string, userId: string): Promise<Prisma.BatchPayload> {
    return this.prisma.task.deleteMany({ where: { parentId, userId } });
  }

  // استخدام Raw query أو delegate للـ pagination
  getTaskDelegate() {
    return this.prisma.task;
  }
}
