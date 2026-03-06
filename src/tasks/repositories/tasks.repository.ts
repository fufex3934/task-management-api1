import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from '../schemas/task.schema';
import { Model } from 'mongoose';
import { CreateTaskDto } from '../dto/create-task.dto';

export interface TaskQueryOptions {
  userId: string;
  page?: number;
  limit?: number;
  completed?: boolean;
  priority?: number;
  sortBy?: 'createdAt' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

@Injectable()
export class TasksRepository {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<TaskDocument> {
    const task = new this.taskModel({ ...createTaskDto, userId });
    return await task.save();
  }

  async findById(id: string, userId: string): Promise<Task | null> {
    return await this.taskModel.findOne({ _id: id, userId, isDeleted: false });
  }

  async findAll(options: TaskQueryOptions): Promise<Task[]> {
    const {
      userId,
      page = 1,
      limit = 10,
      completed,
      priority,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    const filter: any = { userId, isDeleted: false };
    if (completed !== undefined) filter.completed = completed;
    if (priority !== undefined) filter.priority = priority;

    const skip = (page - 1) * limit;

    return this.taskModel
      .find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async updateCompleted(
    id: string,
    completed: boolean,
    userId: string,
  ): Promise<Task | null> {
    return await this.taskModel.findOneAndUpdate(
      { _id: id, userId, isDeleted: false },
      { completed: completed },
      { new: true },
    );
  }

  async softDelete(id: string) {
    return await this.taskModel.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true },
    );
  }
}
