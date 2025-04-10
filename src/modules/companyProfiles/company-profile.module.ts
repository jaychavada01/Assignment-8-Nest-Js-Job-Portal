import { Module } from '@nestjs/common';
import { CompanyProfile } from './entity/companyProfile.entity';
import { CompanyProfileService } from './companyProfile.service';
import { CompanyProfileController } from './companyProfile.controller';
import { User } from '../users/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyProfile, User])],
  providers: [CompanyProfileService],
  controllers: [CompanyProfileController],
  exports: [CompanyProfileService],
})
export class CompanyProfileModule {}
