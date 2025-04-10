import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from 'src/modules/users/entity/user.entity';
import { Job } from 'src/modules/jobs/entity/job.entity';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Job, (job) => job.applications)
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'jobSeekerId' })
  jobSeeker: User;

  @Column({
    type: 'enum',
    enum: [
      'Applied',
      'In Review',
      'Accepted',
      'Interview Scheduled',
      'Rejected',
    ],
    default: 'Applied',
  })
  status: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string;

  @Column({ nullable: true })
  deletedBy: string;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
