import { UseGuards, Controller, Post, Body, Req, Put, Patch, Param, Get, Query, Delete } from "@nestjs/common";
import { AuthGuard } from '../auth/auth.guard';
import { createMainTaskDto } from "./dto/create.main.task.dto";
import { TaskService } from "./task.service";
import { CreateSubtasksDto } from "./dto/create.sub.task.dto";
import { UpdateTaskDto } from "./dto/update.task.dto";
import { GetTasksQueryDto } from "./dto/get-tasks-query.dto";

 @UseGuards(AuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('main')
  async createMain(@Body() dto: createMainTaskDto, @Req() req) {

    const userId = req.user.sub;


    return this.taskService.createMainTask(dto, userId);
   }

@Post('subtasks')
  async createSubtasks(@Body() dto: CreateSubtasksDto, @Req() req) {
    const userId = req.user.sub;

    return this.taskService.createSubtasks(dto, userId);
   }
@Patch(':id')
  async updateTask(
    @Param('id') taskId: string,
    @Body() dto: UpdateTaskDto,
    @Req() req: any
  ) {
    const userId = req.user.sub;

    return this.taskService.updateTask(taskId, dto, userId);
   }
   @Get()
  async getTasks(@Req() req: any, @Query() query: GetTasksQueryDto) {
    const userId = req.user.sub;
    return this.taskService.getTasks(userId, query);
   }
   @Delete(':id')
  async deleteTask(@Param('id') taskId: string, @Req() req: any) {
    const userId = req.user.sub;
    return this.taskService.deleteTask(taskId, userId);
  }
}
