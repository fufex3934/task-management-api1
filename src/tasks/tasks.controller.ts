import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.createTask(createTaskDto);
  }

  @Get(':id')
  findTask(@Param('id') id: string) {
    return this.taskService.findTaskById(id);
  }

  @Get()
  findTasks(@Query() query: TaskQueryDto) {
    return this.taskService.findAllTasks({
      page: query.page || 1,
      limit: query.limit || 10,
      completed:
        query.completed !== undefined
          ? query.completed.toLowerCase() === 'true'
          : undefined,
      priority: query.priority,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });
  }
  @Patch(':id')
  toggleStatus(@Param('id') id: string, @Body() completed: boolean) {
    return this.taskService.toggleCompleted(id, completed);
  }
}
