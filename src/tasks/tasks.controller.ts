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
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly taskService: TasksService,
    @InjectMetric('http_requests_total')
    private requestCounter: Counter<string>,

    @InjectMetric('http_request_duration_seconds')
    private requestHistogram: Histogram<string>,
  ) {}

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
    const end = this.requestHistogram.startTimer();
    this.requestCounter.inc();

    const result = this.taskService.findAllTasks({
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

    end();

    return result;
  }
  @Patch(':id')
  toggleStatus(@Param('id') id: string, @Body() completed: boolean) {
    return this.taskService.toggleCompleted(id, completed);
  }
}
