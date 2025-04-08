import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Feedback } from './model/feedback.model';
import { CreateFeedbackDTO } from './dto/feedback-dto';
import { Application } from '../application/model/application.model';
import { User, UserRole } from '../users/model/user.model';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback) private feedbackModel: typeof Feedback,
    @InjectModel(Application) private applicationModel: typeof Application,
  ) {}

  async giveFeedback(user: User, dto: CreateFeedbackDTO) {
    const application = await this.applicationModel.findByPk(dto.applicationId);
    if (!application) throw new NotFoundException('Application not found');

    if (user.role !== UserRole.Employer || application.createdBy !== user.id) {
      throw new ForbiddenException(
        'Only the employer who created the job can give feedback',
      );
    }

    const existing = await this.feedbackModel.findOne({
      where: { applicationId: dto.applicationId },
    });
    if (existing) {
      throw new ForbiddenException(
        'Feedback already submitted for this application',
      );
    }

    await this.feedbackModel.create({
      applicationId: dto.applicationId,
      employerId: user.id,
      jobSeekerId: application.jobSeekerId,
      feedbackText: dto.feedbackText,
      rating: dto.rating,
    });

    return { message: 'Feedback submitted successfully' };
  }
}
