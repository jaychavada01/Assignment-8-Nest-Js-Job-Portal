import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/model/user.model';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDTO } from './dto/feedback-dto';

@Controller('feedback')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @Roles(UserRole.Employer)
  async giveFeedback(@Request() req, @Body() dto: CreateFeedbackDTO) {
    return this.feedbackService.giveFeedback(req.user, dto);
  }
}
