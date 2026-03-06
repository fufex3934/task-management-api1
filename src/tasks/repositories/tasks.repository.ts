import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from '../schemas/task.schema';
import { Model } from 'mongoose';
import { CreateTaskDto } from '../dto/create-task.dto';

@Injectable()
export class TasksRepository {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = new this.taskModel(createTaskDto);
    return await task.save();
  }

  async findById(id: string): Promise<Task | null> {
    return await this.taskModel.findById(id).exec();
  }

  async findAll(): Promise<Task[]> {
    return await this.taskModel.find().exec();
  }
}
