import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  // ADMIN: Lấy tất cả booking
  @Get('/admin')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  getAllBookings() {
    return this.bookingsService.findAll();
  }

  /**
   * 1. Đặt phòng mới
   * POST /bookings
   */
  @Post()
  create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
    // Đảm bảo req.user.id khớp với logic trong JwtStrategy của bạn
    return this.bookingsService.create(req.user.id, createBookingDto);
  }

  /**
   * 2. Lấy danh sách lịch sử đặt phòng của người dùng hiện tại
   * GET /bookings
   */
  @Get()
  getMyBookings(@Request() req) {
    // Thống nhất dùng req.user.id thay vì req.user.userId
    return this.bookingsService.getMyBookings(req.user.id);
  }

  /**
   * 3. Hủy đặt phòng
   * PATCH /bookings/:id/cancel
   */
  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Request() req) {
    // Sử dụng dấu + để ép kiểu id từ string sang number
    return this.bookingsService.cancel(+id, req.user.id);
  }
}