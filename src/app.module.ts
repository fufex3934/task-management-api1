import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MonitoringModule } from './monitoring/monitoring.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/taskdb'),
    TasksModule,

    MonitoringModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
