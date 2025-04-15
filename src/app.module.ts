import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

// Modules
import { UsersModule } from './modules/users/users.module';
import { CompanyProfileModule } from './modules/companyProfiles/company-profile.module';
import { JobModule } from './modules/jobs/job.module';
import { ApplicationModule } from './modules/application/application.module';
import { FeedbackModule } from './modules/feedback/feedback.module';

// Entities
import { User } from './modules/users/entity/user.entity';
import { CompanyProfile } from './modules/companyProfiles/entity/companyProfile.entity';
import { Job } from './modules/jobs/entity/job.entity';
import { Application } from './modules/application/entity/application.entity';

// Auth Strategy
import { JwtStrategy } from './strategy/jwt.strategy';
import { MailService } from './services/mail.service';

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

    TypeOrmModule.forFeature([User]),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15d' },
      }),
      inject: [ConfigService],
    }),

    // Other feature modules
    UsersModule,
    CompanyProfileModule,
    JobModule,
    ApplicationModule,
    FeedbackModule,
  ],
  providers: [JwtStrategy, MailService],
  exports: [JwtModule, MailService],
})
export class AppModule {}
