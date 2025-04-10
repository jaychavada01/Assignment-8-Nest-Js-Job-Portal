import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entity/user.entity';
import { ApplicationService } from './application.service';
import { ApplyJobDTO, UpdateApplicationStatusDTO } from './dto/application.dto';
import { ScheduleInterviewDTO } from '../interview/dto/interview-dto';

@Controller('application')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post('apply')
  @Roles(UserRole.JobSeeker)
  async applyForJob(@Request() req, @Body() dto: ApplyJobDTO) {
    return this.applicationService.applyForJob(req.user, dto);
  }

  @Patch('status/:id')
  @Roles(UserRole.Admin, UserRole.Employer)
  async updateStatus(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateApplicationStatusDTO,
  ) {
    return this.applicationService.updateApplicationStatus(id, req.user, dto);
  }

  @Patch('interview/:id')
  @Roles(UserRole.Admin, UserRole.Employer)
  async scheduleInterview(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: ScheduleInterviewDTO,
  ) {
    return this.applicationService.scheduleInterview(id, req.user, dto);
  }
}
