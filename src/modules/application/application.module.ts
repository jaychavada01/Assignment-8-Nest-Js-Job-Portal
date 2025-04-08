import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Application } from './model/application.model';
import { Job } from '../jobs/model/job.model';
import { User } from '../users/model/user.model';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { MailModule } from '../mail/mail.module';
import { InterviewInvitation } from '../interview/interview.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Application, Job, User, InterviewInvitation]),
    MailModule,
  ],
  providers: [ApplicationService],
  controllers: [ApplicationController],
})
export class ApplicationModule {}
