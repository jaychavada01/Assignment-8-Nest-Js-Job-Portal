import { IsDateString, IsString } from 'class-validator';

export class ScheduleInterviewDTO {
  @IsDateString()
  interviewDate: string;

  @IsString()
  interviewMode: string;

  @IsString()
  interviewLink: string;
}
