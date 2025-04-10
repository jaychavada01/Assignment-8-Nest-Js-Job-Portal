import { Module } from '@nestjs/common';
import { Job } from './entity/job.entity';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { User } from '../users/entity/user.entity';
import { MailModule } from '../mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Job, User]), MailModule],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
