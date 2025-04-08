import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Feedback } from './model/feedback.model';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { User } from '../users/model/user.model';
import { Application } from '../application/model/application.model';

@Module({
  imports: [SequelizeModule.forFeature([Feedback, User, Application])],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
