import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateReviewDto) {
    // Kiểm tra đơn đặt phòng có tồn tại không
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
    });

    if (!booking) throw new NotFoundException('Đơn đặt phòng không tồn tại');

    // Kiểm tra quyền: Chỉ người đặt (Guest) mới được review
    if (booking.guestId !== userId) {
      throw new ForbiddenException('Bạn không có quyền đánh giá đơn phòng này');
    }

    // Kiểm tra xem đã review chưa (Vì bookingId là unique trong bảng Review)
    const existReview = await this.prisma.review.findUnique({
      where: { bookingId: dto.bookingId },
    });
    if (existReview) throw new BadRequestException('Bạn đã đánh giá đơn này rồi');

    // Tạo review
    return this.prisma.review.create({
      data: {
        bookingId: dto.bookingId,
        userId: userId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });
  }

  // Lấy danh sách Review theo phòng (Property)
  async getReviewsByProperty(propertyId: number) {
    return this.prisma.review.findMany({
      where: {
        booking: { propertyId: propertyId }, // Truy vấn ngược từ Booking
      },
      include: {
        user: { select: { fullName: true, avatar: true } }, // Lấy thông tin người review
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}