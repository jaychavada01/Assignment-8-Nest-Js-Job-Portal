import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from 'src/modules/users/model/user.model';
import { Job } from 'src/modules/jobs/model/job.model';

@Table({
  tableName: 'Applications',
  timestamps: true,
  paranoid: true,
})
export class Application extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Job)
  @Column({ type: DataType.UUID, allowNull: false })
  declare jobId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare jobSeekerId: string;

  @Column({
    type: DataType.ENUM(
      'Applied',
      'In Review',
      'Accepted',
      'Interview Scheduled',
      'Rejected',
    ),
    defaultValue: 'Applied',
  })
  declare status: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare isActive: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare createdBy: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  declare updatedBy: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  declare deletedBy: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare isDeleted: boolean;

  @Column({ type: DataType.DATE, allowNull: true })
  declare deletedAt: Date;
}
