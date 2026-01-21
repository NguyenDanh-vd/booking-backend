import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { NotificationsService } from 'src/notifications/notifications.service'; // 👈 Import Service này

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService // 👈 Inject vào đây
  ) {}

  // 1. Tạo thanh toán
  async create(createPaymentDto: CreatePaymentDto) {
    const { bookingId, provider } = createPaymentDto;

    // A. Kiểm tra Booking
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException('Đơn đặt phòng không tồn tại');
    if (booking.status === 'CONFIRMED') throw new BadRequestException('Đơn này đã được thanh toán rồi');
    if (booking.status === 'CANCELLED') throw new BadRequestException('Đơn này đã bị hủy, không thể thanh toán');

    // B. Lưu thông tin thanh toán
    const payment = await this.prisma.payment.create({
      data: {
        bookingId,
        amount: booking.totalPrice,
        provider,
        status: 'SUCCESS',
        transactionCode: `TRANS_${Date.now()}`,
      },
    });

    // C. Cập nhật trạng thái Booking -> CONFIRMED
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
    });

    // 👇 D. BẮN THÔNG BÁO (ĐOẠN CODE BẠN YÊU CẦU) 👇
    
    // 1. Thông báo cho Khách (Guest)
    await this.notificationsService.create({
        userId: booking.guestId,
        title: 'Thanh toán thành công',
        message: `Đơn đặt phòng #${booking.id} của bạn đã được xác nhận!`,
        type: 'PAYMENT'
    });

    // 2. Thông báo cho Chủ nhà (Host)
    // Cần tìm xem ai là chủ của cái property này
    const property = await this.prisma.properties.findUnique({
        where: { id: booking.propertyId }
    });

    if (property) {
        await this.notificationsService.create({
            userId: property.ownerId,
            title: 'Bạn có đơn đặt phòng mới',
            message: `Khách đã thanh toán cho đơn #${booking.id}. Chuẩn bị đón khách nhé!`,
            type: 'BOOKING'
        });
    }

    return payment;
  }

  // 2. Lấy lịch sử thanh toán của 1 booking
  async findOneByBooking(bookingId: number) {
    return this.prisma.payment.findUnique({
      where: { bookingId },
    });
  }
    async findAllAdmin() {
    return this.prisma.payment.findMany({
      include: {
        booking: {
          include: {
            guest: { select: { fullName: true, email: true } },
            property: { select: { title: true } },
          },
        },
      },
      orderBy: { paymentDate: 'desc' }, 
    });
  }

}