import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entity/application.entity';
import { Job } from '../jobs/entity/job.entity';
import { User, UserRole } from '../users/entity/user.entity';
import { InterviewInvitation } from '../interview/interview.entity';
import { ApplyJobDTO, UpdateApplicationStatusDTO } from './dto/application.dto';
import { ScheduleInterviewDTO } from '../interview/dto/interview-dto';
import { MailService } from '../../services/mail.service';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepo: Repository<Application>,
    @InjectRepository(Job)
    private jobRepo: Repository<Job>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(InterviewInvitation)
    private interviewRepo: Repository<InterviewInvitation>,
    private readonly mailService: MailService,
  ) {}

  async applyForJob(user: User, dto: ApplyJobDTO) {
    const job = await this.jobRepo.findOne({
      where: { id: dto.jobId, status: 'Approved' },
    });
    if (!job) throw new NotFoundException('Job not found or not approved');

    const existing = await this.applicationRepo.findOne({
      where: { job: { id: dto.jobId }, jobSeeker: { id: user.id } },
    });

    if (existing) throw new ForbiddenException('Already applied to this job');

    const application = this.applicationRepo.create({
      job: job,
      jobSeeker: user,
      createdBy: user.id,
    });

    await this.applicationRepo.save(application);

    return { message: 'Application submitted successfully' };
  }

  async updateApplicationStatus(
    applicationId: string,
    user: User,
    dto: UpdateApplicationStatusDTO,
  ) {
    const application = await this.applicationRepo.findOne({
      where: { id: applicationId },
      relations: ['job', 'jobSeeker', 'job.employer'],
    });

    if (!application) throw new NotFoundException('Application not found');

    const job = application.job;
    const isAdmin = user.role === UserRole.Admin;
    const isJobOwner =
      user.role === UserRole.Employer && job.employer?.id === user.id;

    if (!isAdmin && !isJobOwner) {
      throw new ForbiddenException('Unauthorized to update application status');
    }

    application.status = dto.status;
    application.updatedBy = user.id;
    await this.applicationRepo.save(application);

    if (application.jobSeeker?.email) {
      const html = `
        <h3>Your job application status has been updated</h3>
        <p>Job: <strong>${job.title}</strong></p>
        <p>Status: <strong>${dto.status}</strong></p>
      `;
      await this.mailService.sendEmail(
        application.jobSeeker.email,
        'Application Status Updated',
        html,
      );
    }

    return { message: 'Status updated and email sent' };
  }

  async scheduleInterview(
    applicationId: string,
    user: User,
    dto: ScheduleInterviewDTO,
  ) {
    const application = await this.applicationRepo.findOne({
      where: { id: applicationId },
      relations: ['job', 'jobSeeker'],
    });

    if (!application) throw new NotFoundException('Application not found');

    const job = application.job;
    if (
      user.role !== UserRole.Admin &&
      !(user.role === UserRole.Employer && job.employer?.id === user.id)
    ) {
      throw new ForbiddenException('Unauthorized to schedule interview');
    }

    const interview = this.interviewRepo.create({
      application: application,
      jobSeeker: application.jobSeeker,
      interviewDate: new Date(dto.interviewDate),
      interviewMode: dto.interviewMode,
      interviewLink: dto.interviewLink,
    });

    await this.interviewRepo.save(interview);

    // Optional: update status to "Interview Scheduled"
    application.status = 'Interview Scheduled';
    application.updatedBy = user.id;
    await this.applicationRepo.save(application);

    const html = `
      <h3>You are invited for an interview</h3>
      <p>Job: <strong>${job.title}</strong></p>
      <p>Date: <strong>${dto.interviewDate}</strong></p>
      <p>Mode: <strong>${dto.interviewMode}</strong></p>
      <p>Link/Location: <a href="${dto.interviewLink}">${dto.interviewLink}</a></p>
    `;
    await this.mailService.sendEmail(
      application.jobSeeker.email,
      'Interview Invitation',
      html,
    );

    return { message: 'Interview scheduled and invitation sent', interview };
  }
}
