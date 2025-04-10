import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyProfileModule } from './modules/companyProfiles/company-profile.module';
import { JobModule } from './modules/jobs/job.module';
import { MailModule } from './modules/mail/mail.module';
import { ApplicationModule } from './modules/application/application.module';
import { FeedbackModule } from './modules/feedback/feedback.module';

// TypeORM Entities
import { User } from './modules/users/entity/user.entity';
import { CompanyProfile } from './modules/companyProfiles/entity/companyProfile.entity';
import { Job } from './modules/jobs/entity/job.entity';
import { Application } from './modules/application/entity/application.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
      entities: [User, CompanyProfile, Job, Application],
    }),
    UsersModule,
    AuthModule,
    CompanyProfileModule,
    JobModule,
    MailModule,
    ApplicationModule,
    FeedbackModule,
  ],
})
export class AppModule {}
