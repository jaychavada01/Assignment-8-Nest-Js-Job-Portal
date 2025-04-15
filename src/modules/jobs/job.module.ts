import { Module } from '@nestjs/common';
import { Job } from './entity/job.entity';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { User } from '../users/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from 'src/services/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([Job, User])],
  controllers: [JobController],
  providers: [JobService, MailService],
})
export class JobModule {}
