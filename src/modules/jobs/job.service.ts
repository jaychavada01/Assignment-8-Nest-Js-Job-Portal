import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Job } from './model/job.model';
import { CreateJobDTO } from './dto/create-job-dto';
import { UserRole, User } from '../users/model/user.model';
import { Op } from 'sequelize';
import { MailService } from '../mail/mail.service';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job) private jobModel: typeof Job,
    @InjectModel(User) private userModel: typeof User,
    private readonly mailService: MailService,
  ) {}

  async createJob(user: User, dto: CreateJobDTO) {
    if (user.role !== UserRole.Employer) {
      throw new ForbiddenException('Only Employers can create jobs');
    }

    const job = await this.jobModel.create({
      title: dto.title,
      description: dto.description,
      location: dto.location,
      industry: dto.industry,
      experienceLevel: dto.experienceLevel,
      requiredExperience: dto.requiredExperience,
      salaryRange: dto.salaryRange ?? '',
      requiredSkills: dto.requiredSkills ?? [],
      maxApplicants: dto.maxApplicants ?? 10,
      employerId: user.id,
      createdBy: user.id,
    });

    return {
      message: 'Job created successfully, Waiting for Admin Approval',
      jobId: job.id,
      title: job.title,
    };
  }

  async approveJob(jobId: string, admin: User) {
    if (admin.role !== UserRole.Admin) {
      throw new ForbiddenException('Only admin can approve jobs');
    }

    const job = await this.jobModel.findByPk(jobId, {
      include: [
        { model: User, as: 'employer' },
        { model: User, as: 'approvedByUser' },
        { model: User, as: 'rejectedByUser' },
      ],
    });
    if (!job) throw new NotFoundException('Job not found');

    const updatedJob = await job.update({
      status: 'Approved',
      approvedBy: admin.id,
      approvedAt: new Date(),
    });

    // Fetch employer email
    const employer = await this.userModel.findByPk(job.employerId);
    if (employer?.email) {
      const subject = `Your job "${job.title}" has been approved!`;
      const html = `
      <h2>Congratulations!</h2>
      <p>Your job <strong>"${job.title}"</strong> has been approved and is now live on the job board.</p>
    `;
      await this.mailService.sendEmail(employer.email, subject, html);
    }

    return updatedJob;
  }

  async rejectJob(jobId: string, admin: User) {
    if (admin.role !== UserRole.Admin) {
      throw new ForbiddenException('Only admin can reject jobs');
    }

    const job = await this.jobModel.findByPk(jobId, {
      include: [
        { model: User, as: 'employer' },
        { model: User, as: 'approvedByUser' },
        { model: User, as: 'rejectedByUser' },
      ],
    });
    if (!job) throw new NotFoundException('Job not found');

    const updatedJob = await job.update({
      status: 'Rejected',
      rejectedBy: admin.id,
      rejectedAt: new Date(),
    });

    // Fetch employer email
    const employer = await this.userModel.findByPk(job.employerId);
    if (employer) {
      const htmlContent = `<h3>Your job "${job.title}" has been rejected.</h3><p>Please review and resubmit the job with corrections.</p>`;
      await this.mailService.sendEmail(
        employer.email,
        'Job Rejected by Admin',
        htmlContent,
      );
    }

    return updatedJob;
  }

  async searchJobs(query: {
    location?: string;
    skill?: string;
    experience?: number;
  }) {
    const where: any = { status: 'Approved' };

    if (query.location) {
      where.location = { [Op.iLike]: `%${query.location}%` };
    }

    if (query.skill) {
      where.requiredSkills = { [Op.contains]: [query.skill] };
    }

    if (query.experience !== undefined) {
      where.requiredExperience = { [Op.lte]: query.experience };
    }

    return this.jobModel.findAll({ where });
  }
}
