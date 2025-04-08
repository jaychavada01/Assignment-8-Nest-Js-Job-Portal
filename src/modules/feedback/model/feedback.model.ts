import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from 'src/modules/users/model/user.model';
import { Application } from 'src/modules/application/model/application.model';
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

@Table({ tableName: 'Feedbacks', timestamps: true, paranoid: true })
export class Feedback extends Model<
  InferAttributes<Feedback>,
  InferCreationAttributes<Feedback>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => Application)
  @Column(DataType.UUID)
  declare applicationId: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare employerId: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare jobSeekerId: string;

  @Column(DataType.STRING)
  declare feedbackText: string;

  @Column(DataType.INTEGER)
  declare rating: number; // 1 to 5
}
