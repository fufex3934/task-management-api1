import { Injectable, NotFoundException } from '@nestjs/common';
import {
  TaskQueryOptions,
  TasksRepository,
} from './repositories/tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly logger: LoggerService,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, userId: string) {
    const task = await this.tasksRepository.create(createTaskDto, userId);
    this.logger.log(`Task created: ${task._id.toString()}`, TasksService.name);
    return task;
  }

  async findTaskById(id: string, userId: string) {
    const task = await this.tasksRepository.findById(id, userId);

    if (!task) {
      this.logger.warn(`Task not found: ${id}`, TasksService.name);
      throw new NotFoundException('Task not found');
    }
    this.logger.log(`Task retrieved: ${id}`, TasksService.name);
    return task;
  }

  async findAllTasks(query: TaskQueryOptions) {
    return this.tasksRepository.findAll(query);
  }

  async toggleCompleted(id: string, completed: boolean, userId: string) {
    const task = await this.tasksRepository.updateCompleted(
      id,

      completed,
      userId,
    );
    if (!task) {
      this.logger.warn(`Task not found for toggle: ${id}`, TasksService.name);
      throw new NotFoundException('Task not found');
    }
    this.logger.log(
      `Task ${id} completion toggled to ${completed}`,
      TasksService.name,
    );
    return task;
  }
}
