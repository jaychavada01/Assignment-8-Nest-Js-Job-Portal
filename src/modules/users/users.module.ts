// src/modules/users/users.module.ts
import { Module } from '@nestjs/common';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CompanyProfile } from '../companyProfiles/entity/companyProfile.entity';
import { RedisModule } from 'src/shared/redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, CompanyProfile]), RedisModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
