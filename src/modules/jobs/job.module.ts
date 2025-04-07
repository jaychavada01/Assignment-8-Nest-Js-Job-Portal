import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Job } from './model/job.model';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { User } from '../users/model/user.model';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [SequelizeModule.forFeature([Job, User]), MailModule],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
