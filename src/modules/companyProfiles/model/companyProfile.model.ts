import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
} from 'sequelize-typescript';
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { User } from 'src/modules/users/model/user.model';

@Table({
  tableName: 'CompanyProfiles',
  timestamps: true,
  paranoid: true,
})
export class CompanyProfile extends Model<
  InferAttributes<CompanyProfile>,
  InferCreationAttributes<CompanyProfile>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @Column({ allowNull: false, unique: true })
  declare companyName: string;

  @Column(DataType.STRING)
  declare companyLogo: string | null;

  @Column({ allowNull: false })
  declare industry: string;

  @Column({
    type: DataType.ENUM('1-10', '11-50', '51-200', '201-500', '501+'),
    allowNull: false,
  })
  declare companySize: string;

  @Column({ allowNull: false })
  declare location: string;

  @Column(DataType.STRING)
  declare website: CreationOptional<string>;

  @Column(DataType.TEXT)
  declare about: CreationOptional<string>;

  @Column(DataType.INTEGER)
  declare foundedYear: number;

  @Default('Active')
  @Column(DataType.ENUM('Active', 'Inactive'))
  declare status: CreationOptional<string>;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare createdBy: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare updatedBy: CreationOptional<string>;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare deletedBy: CreationOptional<string>;

  @Column(DataType.DATE)
  declare deletedAt: CreationOptional<Date>;
}
