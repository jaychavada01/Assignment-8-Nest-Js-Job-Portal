import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { User, UserRole } from './entity/user.entity';
import { CreateUserDTO } from './dto/create-user-dto';
import { LoginUserDTO } from './dto/login-user-dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDTO } from './dto/update-user-dto';
import { RedisService } from 'src/shared/redis/redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CompanyProfile } from '../companyProfiles/entity/companyProfile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
    private redisService: RedisService,
  ) {}

  // ** REGISTER USER
  async register(
    data: CreateUserDTO,
    profilePic: string | null,
    resume: string | null,
  ): Promise<User> {
    const exists = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (exists) throw new BadRequestException('Email already in use');

    const hashedPassword = await bcrypt.hash(data.password, 10);

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

    const user = this.userRepository.create({
      name: data.name,
      email: data.email,
      role: data.role,
      password: hashedPassword,
      profilePic,
      resume: data.role === UserRole.JobSeeker ? resume : null,
      experience:
        data.role === UserRole.JobSeeker && data.experience
          ? typeof data.experience === 'string'
            ? parseInt(data.experience)
            : data.experience
          : null,
      skills:
        data.role === UserRole.JobSeeker && data.skills
          ? typeof data.skills === 'string'
            ? JSON.parse(data.skills)
            : data.skills
          : null,
      company: companyId ? ({ id: companyId } as CompanyProfile) : null,
    } as DeepPartial<User>);

    const savedUser = await this.userRepository.save(user);
    await this.redisService.del(`users:role:${savedUser.role}`);

    return savedUser;
  }

  // ** LOGIN USER
  async login(
    data: LoginUserDTO,
  ): Promise<{ user: User; accessToken: string }> {
    const user = await this.userRepository.findOne({
      where: { email: data.email },
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
    user.accessToken = accessToken;
    await this.userRepository.save(user);

    // remove sensitive fields
    const { password, ...safeUser } = user;
    return { user: safeUser as User, accessToken };
  }

  // ** LOGOUT USER
  async logout(userId: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.accessToken = null;
    user.isActive = false;
    await this.userRepository.save(user);

    return { message: 'Logged out successfully' };
  }

  // ** Get all users (Admin only)
  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.userRepository.findAndCount({
      where: { isDeleted: false },
      order: { createdAt: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  // ** Get all JobSeekers (Admin & Employer)
  async findAllJobSeekers(
    page = 1,
    limit = 10,
  ): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    const cacheKey = `users:role:${UserRole.JobSeeker}:page:${page}:limit:${limit}`;
    const cached = await this.redisService.get<{ data: User[]; total: number }>(
      cacheKey,
    );

    if (cached) return { ...cached, page, limit };

    const [data, total] = await this.userRepository.findAndCount({
      where: { role: UserRole.JobSeeker, isDeleted: false },
      order: { createdAt: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    await this.redisService.set(cacheKey, { data, total });
    return { data, total, page, limit };
  }

  // ** Admin update user
  async updateUserByAdmin(
    id: string,
    data: UpdateUserDTO,
    updatedById: string,
    profilePic?: string | null,
    resume?: string | null,
  ) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const updatedData = {
      ...user,
      name: data.name ?? user.name,
      email: data.email ?? user.email,
      role: data.role ?? user.role,
      profilePic: profilePic ?? user.profilePic,
      resume: resume ?? user.resume,
      updatedBy: updatedById,
    };

    const saved = await this.userRepository.save(updatedData);

    // Invalidate role cache (only if role exists)
    if (saved.role) {
      await this.redisService.del(`users:role:${user.role}`);
    }

    return { message: 'User updated successfully', user };
  }

  // ** Soft delete user account
  async deleteUserByAdmin(userId: string, deletedById: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isDeleted = true;
    await this.userRepository.softRemove(user);

    // Invalidate role cache
    await this.redisService.del(`users:role:${user.role}`);

    return { message: 'User deleted successfully', deletedById };
  }
}
