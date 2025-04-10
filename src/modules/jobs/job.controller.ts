import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  Get,
  Query,
  Patch,
} from '@nestjs/common';
import { JobService } from './job.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CreateJobDTO } from './dto/create-job-dto';
import { UserRole } from '../users/entity/user.entity';
import { Roles } from '../auth/roles.decorator';

@Controller('jobs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post('create')
  @Roles(UserRole.Employer)
  async createJob(@Request() req, @Body() dto: CreateJobDTO) {
    const user = req.user;
    const result = await this.jobService.createJob(user, dto);
    return {
      statusCode: 201,
      ...result,
    };
  }

  @Patch('approve/:id')
  @Roles(UserRole.Admin)
  async approveJob(@Param('id') jobId: string, @Request() req) {
    const admin = req.user;
    return this.jobService.approveJob(jobId, admin);
  }

  @Patch('reject/:id')
  @Roles(UserRole.Admin)
  async rejectJob(@Param('id') jobId: string, @Request() req) {
    const admin = req.user;
    return this.jobService.rejectJob(jobId, admin);
  }

  @Get('all')
  async searchJobs(
    @Query('location') location?: string,
    @Query('skill') skill?: string,
    @Query('experience') experience?: number,
  ) {
    return this.jobService.searchJobs({
      location,
      skill,
      experience: experience ? Number(experience) : undefined,
    });
  }
}
