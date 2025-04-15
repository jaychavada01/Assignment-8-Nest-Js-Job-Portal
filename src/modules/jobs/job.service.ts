import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Job } from './entity/job.entity';
import { CreateJobDTO } from './dto/create-job-dto';
import { UserRole, User } from '../users/entity/user.entity';
import { MailService } from '../../services/mail.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job) private readonly jobRepo: Repository<Job>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async createJob(user: User, dto: CreateJobDTO) {
    if (user.role !== UserRole.Employer) {
      throw new ForbiddenException('Only Employers can create jobs');
    }

    const job = this.jobRepo.create({
      ...dto,
      employer: user,
      createdBy: user.id,
    });

    const savedJob = await this.jobRepo.save(job);

    return {
      message: 'Job created successfully, Waiting for Admin Approval',
      jobId: savedJob.id,
      title: savedJob.title,
    };
  }

  async approveJob(jobId: string, admin: User) {
    if (admin.role !== UserRole.Admin) {
      throw new ForbiddenException('Only admin can approve jobs');
    }

    const job = await this.jobRepo.findOne({
      where: { id: jobId },
      relations: ['employer'],
    });
    if (!job) throw new NotFoundException('Job not found');

    job.status = 'Approved';
    job.approvedBy = admin.id;
    job.approvedAt = new Date();

    await this.jobRepo.save(job);

    // Fetch employer email
    if (job.employer?.email) {
      const subject = `Your job "${job.title}" has been approved!`;
      const html = `
        <h2>Congratulations!</h2>
        <p>Your job <strong>"${job.title}"</strong> has been approved and is now live on the job board.</p>
      `;
      await this.mailService.sendEmail(job.employer.email, subject, html);
    }

    return job;
  }

  async rejectJob(jobId: string, admin: User) {
    if (admin.role !== UserRole.Admin) {
      throw new ForbiddenException('Only admin can reject jobs');
    }

    const job = await this.jobRepo.findOne({
      where: { id: jobId },
      relations: ['employer'],
    });
    if (!job) throw new NotFoundException('Job not found');

    job.status = 'Rejected';
    job.rejectedBy = admin.id;
    job.rejectedAt = new Date();

    await this.jobRepo.save(job);

    if (job.employer?.email) {
      const htmlContent = `<h3>Your job "${job.title}" has been rejected.</h3><p>Please review and resubmit the job with corrections.</p>`;
      await this.mailService.sendEmail(
        job.employer.email,
        'Job Rejected by Admin',
        htmlContent,
      );
    }

    return job;
  }

  async searchJobs(query: {
    location?: string;
    skill?: string;
    experience?: number;
  }) {
    const where: any = { status: 'Approved' };

    if (query.location) {
      where.location = ILike(`%${query.location}%`);
    }

    if (query.skill) {
      where.requiredSkills = In([query.skill]);
    }

    if (query.experience !== undefined) {
      where.requiredExperience = LessThanOrEqual(query.experience);
    }

    return this.jobRepo.find({ where });
  }
}
