import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsUUID,
  IsArray,
  IsNumber,
  MinLength,
} from 'class-validator';
import { UserRole } from '../model/user.model';

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsUUID()
  companyId?: string; // Only for Employers

  @IsOptional()
  @IsNumber()
  experience?: number; // Only for JobSeekers

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[]; // Only for JobSeekers
}
