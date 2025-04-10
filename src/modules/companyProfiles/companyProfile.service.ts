import { Injectable, ForbiddenException } from '@nestjs/common';
import { CompanyProfile } from './entity/companyProfile.entity';
import { CreateCompanyDTO } from './dto/create-profile-dto';
import { User, UserRole } from 'src/modules/users/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CompanyProfileService {
  constructor(
    @InjectRepository(CompanyProfile)
    private readonly companyRepo: Repository<CompanyProfile>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createCompany(
    userId: string,
    role: UserRole,
    dto: CreateCompanyDTO,
    companyLogo: string | null,
  ): Promise<CompanyProfile> {
    if (role !== UserRole.Admin && role !== UserRole.Employer) {
      throw new ForbiddenException(
        'Only Admins or Employers can create companies',
      );
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new ForbiddenException('User not found');

    const company = this.companyRepo.create({
      ...dto,
      companyLogo: companyLogo ?? undefined,
      createdBy: user,
    });

    return this.companyRepo.save(company);
  }

  async findAll(): Promise<CompanyProfile[]> {
    return this.companyRepo.find({ relations: ['createdBy'] });
  }
}
