import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard) // Bắt buộc đăng nhập mới được đặt phòng
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(req.user.id, createBookingDto);
  }

  @Get('my-bookings')
  findMyBookings(@Request() req) {
    return this.bookingsService.getMyBookings(req.user.id);
  }
}