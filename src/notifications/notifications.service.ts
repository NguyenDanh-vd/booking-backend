import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private notificationsGateway: NotificationsGateway // Đã inject đúng
  ) { }

  // 1. Tạo thông báo mới (SỬA LẠI HÀM NÀY)
  async create(dto: CreateNotificationDto) {
    // Bước A: Lưu vào Database trước
    const data: any = {
      title: dto.title,
      message: dto.message,
      type: dto.type,
      senderId: dto.senderId ?? null,
    };

    // `userId` in schema is required (Int). Only set it when provided.
    if (dto.userId !== undefined && dto.userId !== null) {
      data.userId = dto.userId;
    }

    const savedNotification = await this.prisma.notification.create({
      data,
      // Kèm thêm thông tin người gửi (nếu có) để hiển thị đẹp hơn trên Socket
      include: {
        sender: {
          select: { fullName: true, role: true }
        }
      }
    });


    // Ở đây mình giả sử bắn cho Admin (hoặc tất cả ai đang nghe sự kiện 'new_notification')
    this.notificationsGateway.sendNotificationToAdmin(savedNotification);

    return savedNotification;
  }

  // 2. Lấy danh sách thông báo của User
  async findAllByUser(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 3. Đánh dấu đã đọc
  async markAsRead(id: number) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  // 4. ADMIN: Lấy toàn bộ notification
  async findAll() {
    return this.prisma.notification.findMany({
      include: {
        user: { // Người nhận
          select: {
            fullName: true,
            email: true,
          },
        },
        sender: { // Người gửi (Khách hàng) - Thêm cái này để Admin biết ai gửi
          select: {
            fullName: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}