import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CompanyProfile } from './model/companyProfile.model';
import { CompanyProfileService } from './companyProfile.service';
import { CompanyProfileController } from './companyProfile.controller';
import { User } from '../users/model/user.model';

@Module({
  imports: [SequelizeModule.forFeature([CompanyProfile, User])],
  providers: [CompanyProfileService],
  controllers: [CompanyProfileController],
  exports: [CompanyProfileService],
})
export class CompanyProfileModule {}
