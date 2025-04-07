import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export class ApplyJobDTO {
  @IsUUID()
  @IsNotEmpty()
  jobId: string;
}

export class UpdateApplicationStatusDTO {
  @IsEnum(['In Review', 'Accepted', 'Interview Scheduled', 'Rejected'])
  @IsNotEmpty()
  status: 'In Review' | 'Accepted' | 'Interview Scheduled' | 'Rejected';
}
