import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

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
  findTasks() {
    return this.taskService.findAllTasks();
  }

  @Patch(':id')
  toggleStatus(@Param('id') id: string, @Body() completed: boolean) {
    return this.taskService.toggleCompleted(id, completed);
  }
}
