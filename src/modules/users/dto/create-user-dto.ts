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
import { UserRole } from '../entity/user.entity';
import { Transform, Type } from 'class-transformer';

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
  @Type(() => Number)
  @IsNumber()
  experience?: number; // Only for JobSeekers

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  skills?: string[];
}
