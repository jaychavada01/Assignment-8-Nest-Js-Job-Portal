import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './model/user.model';
import { CreateUserDTO } from './dto/create-user-dto';
import { LoginUserDTO } from './dto/login-user-dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDTO } from './dto/update-user-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private configService: ConfigService,
  ) {}

  // ** REGISTER USER
  async register(
    data: CreateUserDTO,
    profilePic: string | null,
    resume: string | null,
  ): Promise<User> {
    const exists = await this.userModel.findOne({
      where: { email: data.email },
    });

    if (exists) throw new BadRequestException('Email already in use');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userModel.create({
      ...data,
      password: hashedPassword,
      profilePic,
      resume: data.role === 'JobSeeker' ? resume : null,
    });

    return user;
  }

  // ** LOGIN USER
  async login(
    data: LoginUserDTO,
  ): Promise<{ user: User; accessToken: string }> {
    const user = await this.userModel.findOne({
      where: { email: data.email },
      attributes: ['id', 'name', 'email', 'password', 'role', 'accessToken'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: '15d' },
    );

    await user.update({ accessToken });

    const { password, ...safeUser } = user.toJSON();
    return { user: safeUser as User, accessToken };
  }

  // ** LOGOUT USER
  async logout(userId: number): Promise<{ message: string }> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    await user.update({ accessToken: null });

    return { message: 'Logged out successfully' };
  }

  //** Get all users (Admin only)
  async findAll() {
    return this.userModel.findAll({
      order: [['createdAt', 'ASC']],
    });
  }

  // ** Get all JobSeekers (Admin & Employer)
  async findAllJobSeekers() {
    return this.userModel.findAll({
      where: { role: 'JobSeeker' },
    });
  }

  // ** Admin update user
  async updateUserByAdmin(
    id: number,
    data: UpdateUserDTO,
    updatedById: number,
    profilePic?: string | null,
    resume?: string | null,
  ) {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException('User not found');

    // Use existing values if not provided in update
    const updatedData = {
      name: data.name ?? user.name,
      email: data.email ?? user.email,
      role: data.role ?? user.role,
      profilePic: profilePic ?? user.profilePic,
      resume: resume ?? user.resume,
      updatedBy: updatedById,
    };

    await user.update(updatedData);
    return { message: 'User updated successfully', user };
  }

  // ** Soft delete user account
  async deleteUserByAdmin(userId: number, deletedById: number) {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Soft delete: mark deletedBy or use Sequelize's `destroy()` for hard delete
    await user.destroy(); // or `await user.update({ isDeleted: true, deletedBy: deletedById });`

    return { message: 'User deleted successfully', deletedById };
  }
}
