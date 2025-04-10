import { Module } from '@nestjs/common';
import { Application } from './entity/application.entity';
import { Job } from '../jobs/entity/job.entity';
import { User } from '../users/entity/user.entity';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { MailModule } from '../mail/mail.module';
import { InterviewInvitation } from '../interview/interview.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, Job, User, InterviewInvitation]),
    MailModule,
  ],
  providers: [ApplicationService],
  controllers: [ApplicationController],
})
export class ApplicationModule {}
