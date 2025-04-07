// src/modules/users/users.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './model/user.model';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CompanyProfile } from '../companyProfiles/model/companyProfile.model';

@Module({
  imports: [SequelizeModule.forFeature([User, CompanyProfile])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
