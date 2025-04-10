import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CompanyProfileService } from './companyProfile.service';
import { CreateCompanyDTO } from './dto/create-profile-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entity/user.entity';

@Controller('companies')
export class CompanyProfileController {
  constructor(private readonly companyService: CompanyProfileService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Employer)
  @UseInterceptors(FileInterceptor('companyLogo', multerConfig))
  async create(
    @Body() body: CreateCompanyDTO,
    @UploadedFile()
    file: Express.Multer.File,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    const role = req.user?.role;

    const companyLogo = file?.filename || null;

    return this.companyService.createCompany(userId, role, body, companyLogo);
  }
}
