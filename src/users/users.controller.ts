import { BookingsService } from '../bookings/bookings.service';
import { PropertiesService } from '../properties/properties.service';
import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Param,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateVerificationDto } from './dto/update-verification.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly bookingsService: BookingsService,
    private readonly propertiesService: PropertiesService,
  ) {}

  @Get('/admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAdminStats() {
    const totalUsers = await this.usersService.countAll();
    const totalBookings = await this.bookingsService.countAll();
    const totalProperties = await this.propertiesService.countAll();
    const totalRevenue = await this.bookingsService.sumRevenue();
    return { totalUsers, totalBookings, totalProperties, totalRevenue };
  }

  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Patch('profile')
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const result = await this.cloudinaryService.uploadFile(file);
      updateUserDto.avatar = result.secure_url;
    }

    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Patch('role/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateRole(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { role: 'GUEST' | 'HOST' | 'ADMIN' },
  ) {
    if (!body.role) throw new BadRequestException('Thieu role moi');

    return this.usersService.updateRole(Number(id), body.role, {
      id: req.user.id,
      role: req.user.role,
    });
  }

  @Patch('verify/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateVerification(
    @Request() req,
    @Param('id') id: string,
    @Body() body: UpdateVerificationDto,
  ) {
    if (typeof body?.isVerified !== 'boolean') {
      throw new BadRequestException('Thieu trang thai xac thuc');
    }

    return this.usersService.updateVerificationStatus(
      Number(id),
      body.isVerified,
      {
        id: req.user.id,
        role: req.user.role,
      },
    );
  }

  @Get('/admin/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAllUsers(@Query('role') role?: string) {
    if (role) {
      return this.usersService.findByRole(role as 'GUEST' | 'HOST' | 'ADMIN');
    }
    return this.usersService.findAll();
  }
}
