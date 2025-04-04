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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /*
   * =========== CREATING USER WITH 3 ROLE =========
   */
  @Post('create')
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

    if (createUserDto.role === 'JobSeeker') {
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
  @Roles('Admin')
  async getAllUsers() {
    return this.usersService.findAll();
  }

  /*
   * =========== GET ALL JOB SEEKERS (ADMIN & EMPLOYER) =========
   */
  @Get('jobseekers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Employer')
  async getAllJobSeekers() {
    return this.usersService.findAllJobSeekers();
  }

  /*
   * =========== UPDATE USER (ADMIN ONLY) =========
   */
  @Patch('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
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
      +id,
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
  @Roles('Admin')
  async deleteUserById(@Param('id') id: string, @Req() req) {
    const adminId = req.user.id;
    return this.usersService.deleteUserByAdmin(+id, adminId);
  }
}
