import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entity/feedback.entity';
import { CreateFeedbackDTO } from './dto/feedback-dto';
import { Application } from '../application/entity/application.entity';
import { User, UserRole } from '../users/entity/user.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,

    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  async giveFeedback(user: User, dto: CreateFeedbackDTO) {
    const application = await this.applicationRepository.findOne({
      where: { id: dto.applicationId },
      relations: ['job', 'job.employer'], // make sure the relation exists
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Check if the current user is the employer who created the job
    if (
      user.role !== UserRole.Employer ||
      application.job?.employer?.id !== user.id
    ) {
      throw new ForbiddenException(
        'Only the employer who created the job can give feedback',
      );
    }

    const existing = await this.feedbackRepository.findOne({
      where: { application: { id: dto.applicationId } },
    });

    if (existing) {
      throw new ForbiddenException(
        'Feedback already submitted for this application',
      );
    }

    const feedback = this.feedbackRepository.create({
      application: { id: dto.applicationId },
      employer: { id: user.id },
      jobSeeker: { id: application.jobSeeker.id },
      feedbackText: dto.feedbackText,
      rating: dto.rating,
    });

    await this.feedbackRepository.save(feedback);

    return { message: 'Feedback submitted successfully' };
  }
}
