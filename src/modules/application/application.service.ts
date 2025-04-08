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
import { InterviewInvitation } from '../interview/interview.model';
import { ScheduleInterviewDTO } from '../interview/dto/interview-dto';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(Application) private applicationModel: typeof Application,
    @InjectModel(Job) private jobModel: typeof Job,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(InterviewInvitation)
    private interviewModel: typeof InterviewInvitation,
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

  async scheduleInterview(
    applicationId: string,
    user: User,
    dto: ScheduleInterviewDTO,
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
        'Only Admin or Employer of the job can schedule interview',
      );
    }

    const interview = await this.interviewModel.create({
      applicationId,
      jobSeekerId: application.jobSeekerId,
      interviewDate: new Date(dto.interviewDate),
      interviewMode: dto.interviewMode,
      interviewLink: dto.interviewLink,
    });

    const jobSeeker = await this.userModel.findByPk(application.jobSeekerId);
    if (jobSeeker?.email) {
      const html = `
      <h3>You are invited for an interview</h3>
      <p>Job: <strong>${job.title}</strong></p>
      <p>Date: <strong>${dto.interviewDate}</strong></p>
      <p>Mode: <strong>${dto.interviewMode}</strong></p>
      <p>Link/Location: <a href="${dto.interviewLink}">${dto.interviewLink}</a></p>
    `;
      await this.mailService.sendEmail(
        jobSeeker.email,
        'Interview Invitation',
        html,
      );
    }

    return { message: 'Interview scheduled and invitation sent', interview };
  }
}
