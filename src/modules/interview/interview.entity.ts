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
import { Application } from 'src/modules/application/entity/application.entity';
import { User } from 'src/modules/users/entity/user.entity';

@Entity('InterviewInvitations')
export class InterviewInvitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Application)
  @JoinColumn({ name: 'applicationId' })
  application: Application;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'jobSeekerId' })
  jobSeeker: User;

  @Column({ type: 'timestamp', nullable: true })
  interviewDate: Date;

  @Column({ nullable: true })
  interviewMode: string;

  @Column({ nullable: true })
  interviewLink: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
