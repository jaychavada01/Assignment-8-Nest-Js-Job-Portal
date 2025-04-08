import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { User } from './modules/users/model/user.model';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyProfileModule } from './modules/companyProfiles/company-profile.module';
import { JobModule } from './modules/jobs/job.module';
import { MailModule } from './modules/mail/mail.module';
import { CompanyProfile } from './modules/companyProfiles/model/companyProfile.model';
import { Job } from './modules/jobs/model/job.model';
import { ApplicationModule } from './modules/application/application.module';
import { Application } from './modules/application/model/application.model';
import { FeedbackModule } from './modules/feedback/feedback.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true,
      models: [User, Job, CompanyProfile, Application],
    }),
    SequelizeModule.forFeature([User, Job, CompanyProfile, Application]),
    AuthModule,
    UsersModule,
    CompanyProfileModule,
    MailModule,
    JobModule,
    ApplicationModule,
    FeedbackModule,
  ],
})
export class AppModule {}
