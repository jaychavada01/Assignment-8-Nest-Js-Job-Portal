import { IsNotEmpty, IsUUID, IsString, IsInt, Min, Max } from 'class-validator';

export class CreateFeedbackDTO {
  @IsUUID()
  applicationId: string;

  @IsString()
  @IsNotEmpty()
  feedbackText: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
