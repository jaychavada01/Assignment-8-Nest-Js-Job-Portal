import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserRole } from './model/user.model';
import { CreateUserDTO } from './dto/create-user-dto';
import { LoginUserDTO } from './dto/login-user-dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDTO } from './dto/update-user-dto';
import { RedisService } from 'src/shared/redis/redis.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private configService: ConfigService,
    private redisService: RedisService,
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

    // Conditional companyId validation
    let companyId: string | null = null;

    if (data.role === UserRole.Employer) {
      if (!data.companyId) {
        throw new BadRequestException(
          'Employer must be associated with a companyId',
        );
      }
      companyId = data.companyId;
    } else if (data.companyId) {
      throw new BadRequestException(
        'Only Employer can be associated with a companyId',
      );
    }

    const parsedSkills =
      data.role === UserRole.JobSeeker && typeof data.skills === 'string'
        ? JSON.parse(data.skills)
        : null;

    const parsedExperience =
      data.role === UserRole.JobSeeker && typeof data.experience === 'string'
        ? parseInt(data.experience)
        : data.experience;

    const user = await this.userModel.create({
      ...data,
      password: hashedPassword,
      profilePic,
      resume: data.role === UserRole.JobSeeker ? resume : null,
      experience: data.role === UserRole.JobSeeker ? parsedExperience : null,
      skills: data.role === UserRole.JobSeeker ? parsedSkills : null,
      companyId,
    });

    // Invalidate Redis Cache for this role
    await this.redisService.del(`users:role:${user.role}`);
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

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) throw new Error('JWT_SECRET is not defined');

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
  async logout(userId: string): Promise<{ message: string }> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    await user.update({ accessToken: null });

    return { message: 'Logged out successfully' };
  }

  // ** Get all users (Admin only)
  async findAll() {
    return this.userModel.findAll({
      order: [['createdAt', 'ASC']],
    });
  }

  // ** Get all JobSeekers (Admin & Employer)
  async findAllJobSeekers() {
    const cacheKey = `users:role:${UserRole.JobSeeker}`;
    const cachedUsers = await this.redisService.get<User[]>(cacheKey);
    if (cachedUsers) return cachedUsers;

    const users = await this.userModel.findAll({
      where: { role: UserRole.JobSeeker },
    });

    await this.redisService.set(cacheKey, users);
    return users;
  }

  // ** Admin update user
  async updateUserByAdmin(
    id: string,
    data: UpdateUserDTO,
    updatedById: string,
    profilePic?: string | null,
    resume?: string | null,
  ) {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException('User not found');

    const updatedData = {
      name: data.name ?? user.name,
      email: data.email ?? user.email,
      role: data.role ?? user.role,
      profilePic: profilePic ?? user.profilePic,
      resume: resume ?? user.resume,
      updatedBy: updatedById,
    };

    await user.update(updatedData);

    // Invalidate role cache (only if role exists)
    if (user.role) {
      await this.redisService.del(`users:role:${user.role}`);
    }

    return { message: 'User updated successfully', user };
  }

  // ** Soft delete user account
  async deleteUserByAdmin(userId: string, deletedById: string) {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await user.destroy(); // Soft delete or mark deletedBy if soft delete logic needed

    // Invalidate role cache
    await this.redisService.del(`users:role:${user.role}`);

    return { message: 'User deleted successfully', deletedById };
  }
}
