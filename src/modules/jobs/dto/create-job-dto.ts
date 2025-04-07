import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
} from 'class-validator';

export class CreateJobDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  industry: string;

  @IsNotEmpty()
  @IsEnum(['Entry', 'Mid', 'Senior'])
  experienceLevel: 'Entry' | 'Mid' | 'Senior';

  @IsOptional()
  @IsString()
  salaryRange?: string;

  @IsOptional()
  @IsInt()
  requiredExperience: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredSkills?: string[];

  @IsOptional()
  @IsInt()
  maxApplicants?: number;
}
