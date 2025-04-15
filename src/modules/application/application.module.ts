import { Module } from '@nestjs/common';
import { Application } from './entity/application.entity';
import { Job } from '../jobs/entity/job.entity';
import { User } from '../users/entity/user.entity';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { InterviewInvitation } from '../interview/interview.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from 'src/services/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, Job, User, InterviewInvitation]),
  ],
  providers: [ApplicationService, MailService],
  controllers: [ApplicationController],
})
export class ApplicationModule {}
