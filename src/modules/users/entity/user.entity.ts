import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { CompanyProfile } from 'src/modules/companyProfiles/entity/companyProfile.entity';
import { Job } from 'src/modules/jobs/entity/job.entity';

export enum UserRole {
  Admin = 'Admin',
  Employer = 'Employer',
  JobSeeker = 'JobSeeker',
}

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ type: 'text', nullable: true })
  accessToken: string | null;

  @Column({ nullable: true })
  profilePic: string;

  @Column({ nullable: true })
  resume: string;

  @Column({ type: 'int', nullable: true })
  experience: number;

  @Column('text', { array: true, nullable: true })
  skills: string[];

  @OneToMany(() => Job, (job) => job.employer)
  jobs: Job[];

  @ManyToOne(() => CompanyProfile, { nullable: true })
  @JoinColumn({ name: 'companyId' })
  company: CompanyProfile;

  @Column({ type: 'uuid', nullable: true })
  updatedBy: string;

  @Column({ type: 'uuid', nullable: true })
  deletedBy: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: Boolean, default: false })
  isDeleted: boolean;

  @Column({ type: Boolean, default: true })
  isActive: boolean;
}
