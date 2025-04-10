import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  Req,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user-dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LoginUserDTO } from './dto/login-user-dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateUserDTO } from './dto/update-user-dto';
import { User, UserRole } from './entity/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /*
   * =========== CREATING USER WITH 3 ROLE =========
   */
  @Post('create')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'profilePic', maxCount: 1 },
        { name: 'resume', maxCount: 1 },
      ],
      multerConfig,
    ),
  )
  async create(
    @Body() createUserDto: CreateUserDTO,
    @UploadedFiles()
    files: {
      profilePic?: Array<Express.Multer.File>;
      resume?: Array<Express.Multer.File>;
    },
  ) {
    const profilePic = files?.profilePic?.[0]?.filename || null;
    const resume = files?.resume?.[0]?.filename || null;

    if (createUserDto.role === UserRole.JobSeeker) {
      return this.usersService.register(createUserDto, profilePic, resume);
    }

    if (files?.resume?.length) {
      throw new BadRequestException('Only JobSeekers can upload resumes');
    }

    return this.usersService.register(createUserDto, profilePic, null);
  }

  /*
   * =========== LOGIN USER =========
   */
  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() data: LoginUserDTO) {
    return this.usersService.login(data);
  }

  /*
   * =========== LOGUSER =========
   */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req) {
    const userId = req.user.id;
    return this.usersService.logout(userId);
  }

  /*
   * =========== GET ALL USER (ONLY ADMIN) =========
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async getAllUsers(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.usersService.findAll(Number(page), Number(limit));
  }

  /*
   * =========== GET ALL JOB SEEKERS (ADMIN & EMPLOYER) =========
   */
  @Get('jobseekers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Employer)
  async getAllJobSeekers(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.usersService.findAllJobSeekers(Number(page), Number(limit));
  }

  /*
   * =========== UPDATE USER (ADMIN ONLY) =========
   */
  @Patch('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'profilePic', maxCount: 1 },
        { name: 'resume', maxCount: 1 },
      ],
      multerConfig,
    ),
  )
  async updateUserByAdmin(
    @Param('id') id: string,
    @Body() data: UpdateUserDTO,
    @UploadedFiles()
    files: {
      profilePic?: Array<Express.Multer.File>;
      resume?: Array<Express.Multer.File>;
    },
    @Req() req,
  ) {
    const adminId = req.user.id;
    const profilePic = files?.profilePic?.[0]?.filename || null;
    const resume = files?.resume?.[0]?.filename || null;

    return this.usersService.updateUserByAdmin(
      id,
      data,
      adminId,
      profilePic,
      resume,
    );
  }

  /*
   * =========== SOFT DELETE USER (ADMIN ONLY) =========
   */
  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async deleteUserById(@Param('id') id: string, @Req() req) {
    const adminId = req.user.id;
    return this.usersService.deleteUserByAdmin(id, adminId);
  }
}
