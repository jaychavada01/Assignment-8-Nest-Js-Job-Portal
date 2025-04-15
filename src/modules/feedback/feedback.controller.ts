import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';
import { RolesGuard } from '../../guard/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../users/entity/user.entity';
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
