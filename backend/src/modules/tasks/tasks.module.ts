import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { GamificationService } from '../gamification/gamification.service';

@Module({
  providers: [TasksService, GamificationService],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule {}
