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
import { Application } from 'src/modules/application/entity/application.entity';

@Entity('Feedbacks')
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Application)
  @JoinColumn({ name: 'applicationId' })
  application: Application;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'employerId' })
  employer: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'jobSeekerId' })
  jobSeeker: User;

  @Column()
  feedbackText: string;

  @Column({ type: 'int' })
  rating: number; // 1 to 5

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
