import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateBookingDto) {
    const { propertyId, checkIn, checkOut } = dto;
    
    // 1. Chuyển string sang Date object để so sánh
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const now = new Date();

    // Validate ngày tháng
    if (startDate < now) {
      throw new BadRequestException('Ngày check-in không được ở trong quá khứ');
    }
    if (startDate >= endDate) {
      throw new BadRequestException('Ngày check-out phải sau ngày check-in');
    }

    // 2. Tìm phòng để lấy giá tiền
    const property = await this.prisma.properties.findUnique({
      where: { id: propertyId },
    });
    if (!property) throw new NotFoundException('Phòng không tồn tại');

    // 3. KIỂM TRA TRÙNG LỊCH (Logic quan trọng nhất)
    // Tìm xem có booking nào ĐANG TỒN TẠI mà thời gian bị trùng không
    // Công thức: (NewStart < ExistingEnd) AND (NewEnd > ExistingStart)
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

    // 4. Tính tiền
    const oneDay = 24 * 60 * 60 * 1000; // mili giây
    const diffDays = Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / oneDay));
    const totalPrice = Number(property.pricePerNight) * diffDays;

    // 5. Tạo Booking
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