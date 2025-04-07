import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Unique,
  ForeignKey,
} from 'sequelize-typescript';
import { CompanyProfile } from 'src/modules/companyProfiles/model/companyProfile.model';

export enum UserRole {
  Admin = 'Admin',
  Employer = 'Employer',
  JobSeeker = 'JobSeeker',
}

@Table({
  tableName: 'Users',
  timestamps: true,
  paranoid: true,
})
export class User extends Model<User, Partial<User>> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column
  declare name: string;

  @AllowNull(false)
  @Unique
  @Column
  declare email: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare password: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(UserRole)))
  declare role: UserRole;

  @Default(null)
  @Column(DataType.TEXT)
  declare accessToken: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare profilePic: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare resume: string | null;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare experience: number | null;

  @AllowNull(true)
  @Column(DataType.ARRAY(DataType.STRING))
  declare skills: string[] | null;

  @ForeignKey(() => CompanyProfile)
  @AllowNull(true)
  @Column(DataType.UUID)
  declare companyId: string | null;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column(DataType.UUID)
  updatedBy: string;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  deletedBy: number;

  @Default(null)
  @Column({ type: DataType.DATE })
  declare deletedAt: Date;
}
