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
import { User } from 'src/modules/users/entity/user.entity';
import { Application } from 'src/modules/application/entity/application.entity';

@Entity('Jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.jobs)
  @JoinColumn({ name: 'employerId' })
  employer: User;

  @OneToMany(() => Application, (application) => application.job)
  applications: Application[];

  @Column({ nullable: true })
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ type: 'enum', enum: ['Entry', 'Mid', 'Senior'] })
  experienceLevel: string;

  @Column({ nullable: true })
  salaryRange: string;

  @Column({
    type: 'enum',
    enum: ['Pending', 'Approved', 'Rejected', 'Closed'],
    default: 'Pending',
  })
  status: string;

  @Column({ default: 0 })
  requiredExperience: number;

  @Column('text', { array: true, default: [] })
  requiredSkills: string[];

  @Column({ default: 10 })
  maxApplicants: number;

  @Column({ default: 0 })
  currentApplicants: number;

  @Column({ type: 'uuid', nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  rejectedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  rejectedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
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
