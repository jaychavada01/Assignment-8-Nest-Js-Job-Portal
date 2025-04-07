import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/modules/users/model/user.model';
import { Optional } from 'sequelize';

// Define the interface for attributes
export interface JobAttributes {
  id: string;
  employerId: string;
  title: string;
  description: string;
  location: string;
  industry: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior';
  salaryRange?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Closed';
  requiredExperience: number;
  requiredSkills?: string[];
  maxApplicants: number;
  currentApplicants: number;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  isActive: boolean;
  createdBy: string;
  updatedBy?: string;
  deletedBy?: string;
  isDeleted: boolean;
}

// Make optional those that may not be provided during creation
export type JobCreationAttributes = Optional<
  JobAttributes,
  | 'id'
  | 'salaryRange'
  | 'requiredSkills'
  | 'maxApplicants'
  | 'currentApplicants'
  | 'approvedBy'
  | 'approvedAt'
  | 'rejectedBy'
  | 'rejectedAt'
  | 'updatedBy'
  | 'deletedBy'
  | 'isDeleted'
  | 'status'
  | 'isActive'
>;

@Table({
  tableName: 'Jobs',
  timestamps: true,
  paranoid: true,
})
export class Job extends Model<JobAttributes, JobCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare employerId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare description: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare location: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare industry: string;

  @Column({
    type: DataType.ENUM('Entry', 'Mid', 'Senior'),
    allowNull: false,
  })
  declare experienceLevel: 'Entry' | 'Mid' | 'Senior';

  @Column({ type: DataType.STRING, allowNull: true })
  declare salaryRange: string;

  @Column({
    type: DataType.ENUM('Pending', 'Approved', 'Rejected', 'Closed'),
    defaultValue: 'Pending',
  })
  declare status: 'Pending' | 'Approved' | 'Rejected' | 'Closed';

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  declare requiredExperience: number;

  @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
  declare requiredSkills: string[];

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 10 })
  declare maxApplicants: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  declare currentApplicants: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  declare approvedBy: string;

  @Column({ type: DataType.DATE, allowNull: true })
  declare approvedAt: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  declare rejectedBy: string;

  @Column({ type: DataType.DATE, allowNull: true })
  declare rejectedAt: Date;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  declare createdBy: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  declare updatedBy: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  declare deletedBy: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  declare isDeleted: boolean;
}
