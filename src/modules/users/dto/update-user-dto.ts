import { UserRole } from '../entity/user.entity';
import { IsOptional, IsEnum } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  name?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be Admin, Employer, or JobSeeker' })
  role?: UserRole;
}
