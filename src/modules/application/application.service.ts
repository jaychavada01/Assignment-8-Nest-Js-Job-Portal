import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Application } from './model/application.model';
import { Job } from '../jobs/model/job.model';
import { User, UserRole } from '../users/model/user.model';
import { MailService } from '../mail/mail.service';
import { ApplyJobDTO, UpdateApplicationStatusDTO } from './dto/application.dto';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(Application) private applicationModel: typeof Application,
    @InjectModel(Job) private jobModel: typeof Job,
    @InjectModel(User) private userModel: typeof User,
    private readonly mailService: MailService,
  ) {}

  async applyForJob(user: User, dto: ApplyJobDTO) {
    const job = await this.jobModel.findByPk(dto.jobId);
    if (!job || job.status !== 'Approved') {
      throw new NotFoundException('Job not found or not available');
    }

    const existingApplication = await this.applicationModel.findOne({
      where: { jobId: dto.jobId, jobSeekerId: user.id },
    });
    if (existingApplication) {
      throw new ForbiddenException('You have already applied for this job');
    }

    await this.applicationModel.create({
      jobId: dto.jobId,
      jobSeekerId: user.id,
      createdBy: user.id,
    });

    return { message: 'Application submitted successfully' };
  }

  async updateApplicationStatus(
    applicationId: string,
    user: User,
    dto: UpdateApplicationStatusDTO,
  ) {
    const application = await this.applicationModel.findByPk(applicationId);
    if (!application) throw new NotFoundException('Application not found');

    const job = await this.jobModel.findByPk(application.jobId);
    if (!job) throw new NotFoundException('Job not found');

    if (
      user.role !== UserRole.Admin &&
      !(user.role === UserRole.Employer && job.employerId === user.id)
    ) {
      throw new ForbiddenException(
        'Only admin or employer of the job can update status',
      );
    }

    await application.update({
      status: dto.status,
      updatedBy: user.id,
    });

    const applicant = await this.userModel.findByPk(application.jobSeekerId);
    if (applicant?.email) {
      const html = `
        <h3>Your job application status has been updated</h3>
        <p>Job: <strong>${job.title}</strong></p>
        <p>Status: <strong>${dto.status}</strong></p>
      `;
      await this.mailService.sendEmail(
        applicant.email,
        'Application Status Updated',
        html,
      );
    }

    return { message: 'Application status updated and email sent' };
  }
}
