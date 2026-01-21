import { BookingsService } from '../bookings/bookings.service';
import { PropertiesService } from '../properties/properties.service';
import {
  Controller, Get, Body, Patch, UseGuards, Request,
  UseInterceptors, UploadedFile, BadRequestException, Param
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly bookingsService: BookingsService,
    private readonly propertiesService: PropertiesService
  ) { }
  // ADMIN: Thống kê tổng quan cho dashboard
  @Get('/admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAdminStats() {
    // Tổng số user
    const totalUsers = await this.usersService.countAll();
    // Tổng số booking
    const totalBookings = await this.bookingsService.countAll();
    // Tổng số property
    const totalProperties = await this.propertiesService.countAll();
    // Tổng doanh thu (sum totalPrice của booking status COMPLETED)
    const totalRevenue = await this.bookingsService.sumRevenue();
    return { totalUsers, totalBookings, totalProperties, totalRevenue };
  }

  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  // API UPDATE (Kèm upload ảnh)
  @Patch('profile')
  @UseInterceptors(FileInterceptor('avatar')) // 'avatar' là tên key trong Form Data
  async update(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File // Nhận file từ request
  ) {
    // Nếu có gửi file thì upload lên Cloudinary
    if (file) {
      const result = await this.cloudinaryService.uploadFile(file);
      updateUserDto.avatar = result.secure_url; // Lấy link ảnh gán vào DTO
    }

    return this.usersService.update(req.user.id, updateUserDto);
  }

  // ADMIN: Đổi role user (GUEST <-> HOST <-> ADMIN)
  @Patch('role/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateRole(@Request() req, @Param('id') id: string, @Body() body: { role: 'GUEST' | 'HOST' | 'ADMIN' }) {
    if (!body.role) throw new BadRequestException('Thiếu role mới');
    // Chỉ ADMIN mới được đổi role, kể cả đổi sang ADMIN
    return this.usersService.updateRole(Number(id), body.role, { id: req.user.id, role: req.user.role });
  }

  // ADMIN: Lấy danh sách user
  @Get('/admin/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAllUsers() {
    return this.usersService.findAll();
  }
}