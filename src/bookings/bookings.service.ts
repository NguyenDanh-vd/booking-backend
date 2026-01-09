import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateBookingDto) {
    const { propertyId, checkIn, checkOut } = dto;
    
    // 1. Kiểm tra dữ liệu ngày tháng
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const now = new Date();

    // Xoá phần thời gian để chỉ so sánh ngày
    if (startDate < now) {
      throw new BadRequestException('Ngày check-in không được ở trong quá khứ');
    }
    if (startDate >= endDate) {
      throw new BadRequestException('Ngày check-out phải sau ngày check-in');
    }

    // Kiểm tra phòng có tồn tại không
    const property = await this.prisma.properties.findUnique({
      where: { id: propertyId },
    });
    if (!property) throw new NotFoundException('Phòng không tồn tại');

    // Kiểm tra phòng đã được đặt trong khoảng thời gian này chưa
    const conflictingBooking = await this.prisma.booking.findFirst({
      where: {
        propertyId: propertyId,
        status: { not: 'CANCELLED' }, // Không tính các đơn đã hủy
        AND: [
          { checkIn: { lt: endDate } }, // lt = less than (nhỏ hơn)
          { checkOut: { gt: startDate } }, // gt = greater than (lớn hơn)
        ],
      },
    });

    if (conflictingBooking) {
      throw new BadRequestException('Phòng đã kín lịch trong khoảng thời gian này!');
    }

    // Tính tiền
    const oneDay = 24 * 60 * 60 * 1000; // mili giây
    const diffDays = Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / oneDay));
    const totalPrice = Number(property.pricePerNight) * diffDays;

    // Tạo Booking
    return this.prisma.booking.create({
      data: {
        checkIn: startDate,
        checkOut: endDate,
        totalPrice: totalPrice,
        guestId: userId,
        propertyId: propertyId,
        status: 'CONFIRMED', // Tạm thời để luôn là Confirmed cho nhanh
      },
    });
  }

  // Lấy danh sách booking của User (Lịch sử đặt phòng)
  async getMyBookings(userId: number) {
    return this.prisma.booking.findMany({
      where: { guestId: userId },
      include: { property: true }, // Kèm thông tin phòng
      orderBy: { createdAt: 'desc' },
    });
  }
}