import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
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
  createTask(@Body() createTaskDto: CreateTaskDto, @Req() req: any) {
    return this.taskService.createTask(createTaskDto, req.user.userId);
  }

  @Get(':id')
  findTask(@Param('id') id: string, @Req() req: any) {
    return this.taskService.findTaskById(id, req.user.userId);
  }

  @Get()
  findTasks(@Query() query: TaskQueryDto, @Req() req: any) {
    const end = this.requestHistogram.startTimer();
    this.requestCounter.inc();

    const userId = req.user.userId;

    const result = this.taskService.findAllTasks({
      userId,
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
  toggleStatus(
    @Param('id') id: string,
    @Body() completed: boolean,
    @Req() req: any,
  ) {
    return this.taskService.toggleCompleted(id, completed, req.user.userId);
  }
}
