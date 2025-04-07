import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CompanyProfile } from './model/companyProfile.model';
import { CreateCompanyDTO } from './dto/create-profile-dto';
import { UserRole } from 'src/modules/users/model/user.model';

@Injectable()
export class CompanyProfileService {
  constructor(
    @InjectModel(CompanyProfile)
    private companyModel: typeof CompanyProfile,
  ) {}

  async createCompany(
    userId: string,
    role: UserRole,
    dto: CreateCompanyDTO,
    companyLogo: string | null,
  ): Promise<CompanyProfile> {
    if (role !== UserRole.Admin) {
      throw new ForbiddenException('Only Admins can create companies');
    }

    const company = await this.companyModel.create({
      ...dto,
      companyLogo,
      createdBy: userId,
    });

    return company;
  }

  async findAll(): Promise<CompanyProfile[]> {
    return this.companyModel.findAll();
  }
}
