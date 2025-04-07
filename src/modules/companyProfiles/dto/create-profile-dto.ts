import {
  IsString,
  IsEnum,
  IsUrl,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateCompanyDTO {
  @IsString()
  companyName: string;

  @IsString()
  industry: string;

  @IsEnum(['1-10', '11-50', '51-200', '201-500', '501+'])
  companySize: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsInt()
  @Min(1800)
  @Max(new Date().getFullYear())
  foundedYear: number;
}
