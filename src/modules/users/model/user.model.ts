import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
  AllowNull,
  Unique,
} from 'sequelize-typescript';

export enum UserRole {
  Admin = 'Admin',
  Employer = 'Employer',
  JobSeeker = 'JobSeeker',
}

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
})
export class User extends Model<User, Partial<User>> {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

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
  updatedBy: number;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  deletedBy: number;

  @Default(null)
  @Column({ type: DataType.DATE })
  declare deletedAt: Date;
}
