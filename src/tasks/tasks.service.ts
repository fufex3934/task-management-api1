import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './repositories/tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async createTask(createTaskDto: CreateTaskDto) {
    return this.tasksRepository.create(createTaskDto);
  }

  async findTaskById(id: string) {
    const task = await this.tasksRepository.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async findAllTasks() {
    return this.tasksRepository.findAll();
  }

  async toggleCompleted(id: string, completed: boolean) {
    const task = await this.tasksRepository.updateCompleted(id, completed);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }
}
