import {
  Table,
  Model,
  Column,
  ForeignKey,
  DataType,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { Application } from '../application/model/application.model';
import { User } from '../users/model/user.model';

@Table({ tableName: 'InterviewInvitations', timestamps: true, paranoid: true })
export class InterviewInvitation extends Model<
  InferAttributes<InterviewInvitation>,
  InferCreationAttributes<InterviewInvitation>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => Application)
  @Column(DataType.UUID)
  declare applicationId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  declare jobSeekerId: string;

  @Column(DataType.DATE)
  declare interviewDate: Date;

  @Column(DataType.STRING)
  declare interviewMode: string;

  @Column(DataType.STRING)
  declare interviewLink: string;
}
