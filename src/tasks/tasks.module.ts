import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksRepository } from './repositories/tasks.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schemas/task.schema';
import { LoggerModule } from 'src/logger/logger.module';
import {
  makeCounterProvider,
  makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    LoggerModule,
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    TasksRepository,
    makeCounterProvider({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
    }),

    makeHistogramProvider({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      buckets: [0.1, 0.5, 1, 2, 5],
    }),
  ],
})
export class TasksModule {}
