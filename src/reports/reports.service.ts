import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  // 1. THỐNG KÊ CHO ADMIN (Toàn sàn)
  async getAdminStats() {
    // A. Đếm số lượng
    const totalUsers = await this.prisma.user.count();
    const totalProperties = await this.prisma.properties.count();
    const totalBookings = await this.prisma.booking.count();

    // B. Tính tổng doanh thu (Dựa trên bảng Payment đã SUCCESS)
    const revenueAgg = await this.prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'SUCCESS',
      },
    });

    // C. Lấy 5 booking mới nhất
    const recentBookings = await this.prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        guest: { select: { fullName: true, email: true } },
        property: { select: { title: true } },
      },
    });

    return {
      totalUsers,
      totalProperties,
      totalBookings,
      totalRevenue: Number(revenueAgg._sum.amount) || 0,
      recentBookings,
    };
  }

  // 2. THỐNG KÊ CHO HOST (Cá nhân)
  async getHostStats(hostId: number) {
    // A. Tổng doanh thu của Host (Chỉ tính đơn đã HOÀN THÀNH)
    // Prisma chưa hỗ trợ join sâu để aggregate trực tiếp dễ dàng, 
    // ta có thể query booking trước.
    const completedBookings = await this.prisma.booking.findMany({
      where: {
        property: { ownerId: hostId },
        status: 'COMPLETED',
      },
      select: { totalPrice: true, createdAt: true },
    });

    const totalEarnings = completedBookings.reduce(
      (sum, booking) => sum + Number(booking.totalPrice),
      0,
    );

    // B. Đếm số lượng Booking theo trạng thái
    const bookingsCount = await this.prisma.booking.groupBy({
      by: ['status'],
      where: {
        property: { ownerId: hostId },
      },
      _count: {
        id: true,
      },
    });

    // Format lại dữ liệu đếm cho đẹp
    const statsByStatus = {
      PENDING: 0,
      CONFIRMED: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };
    bookingsCount.forEach((item) => {
      if (statsByStatus[item.status] !== undefined) {
        statsByStatus[item.status] = item._count.id;
      }
    });

    // C. Biểu đồ doanh thu theo tháng (Chart Data) trong năm nay
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = Array(12).fill(0); // [0, 0, ..., 0] cho 12 tháng

    completedBookings.forEach((booking) => {
      const date = new Date(booking.createdAt);
      if (date.getFullYear() === currentYear) {
        const month = date.getMonth(); // 0 = Jan, 11 = Dec
        monthlyRevenue[month] += Number(booking.totalPrice);
      }
    });

    return {
      totalEarnings,
      totalBookings: completedBookings.length, // Hoặc tổng tất cả status
      statsByStatus,
      chartData: {
        year: currentYear,
        data: monthlyRevenue,
      },
    };
  }
}