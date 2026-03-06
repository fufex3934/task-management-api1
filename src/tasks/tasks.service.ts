import { Injectable } from '@nestjs/common';
import { TasksRepository } from './repositories/tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async createTask(createTaskDto: CreateTaskDto) {
    return this.tasksRepository.create(createTaskDto);
  }

  async findTaskById(id: string) {
    return this.tasksRepository.findById(id);
  }

  async findAllTasks() {
    return this.tasksRepository.findAll();
  }

  async toggleCompleted(id: string, completed: boolean) {
    return this.tasksRepository.updateCompleted(id, completed);
  }
}
