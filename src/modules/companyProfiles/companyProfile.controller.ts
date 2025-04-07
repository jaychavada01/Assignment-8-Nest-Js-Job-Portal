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

@Controller('companies')
export class CompanyProfileController {
  constructor(private readonly companyService: CompanyProfileService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('companyLogo', multerConfig))
  async create(
    @Body() body: CreateCompanyDTO,
    @UploadedFile()
    files: {
      companyLogo?: Array<Express.Multer.File>;
    },
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    const role = req.user?.role;

    const companyLogo = files?.companyLogo?.[0]?.filename || null;

    return this.companyService.createCompany(userId, role, body, companyLogo);
  }
}
