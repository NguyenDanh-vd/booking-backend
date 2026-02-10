import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
<<<<<<< HEAD

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  // 1. Tạo thông báo mới (Thường được gọi từ các Service khác)
  async create(dto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        userId: dto.userId,
        title: dto.title,
        message: dto.message,
        type: dto.type,
      },
    });
=======
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
>>>>>>> upstream/main
  }

  // 2. Lấy danh sách thông báo của User
  async findAllByUser(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
<<<<<<< HEAD
=======
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
>>>>>>> upstream/main
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

<<<<<<< HEAD
    // 4. ADMIN: Lấy toàn bộ notification
  async findAll() {
    return this.prisma.notification.findMany({
      include: {
        user: {
=======
  // 4. ADMIN: Lấy toàn bộ notification
  async findAll() {
    return this.prisma.notification.findMany({
      include: {
        user: { // Người nhận
>>>>>>> upstream/main
          select: {
            fullName: true,
            email: true,
          },
        },
<<<<<<< HEAD
=======
        sender: { // Người gửi (Khách hàng) - Thêm cái này để Admin biết ai gửi
          select: {
            fullName: true,
          }
        }
>>>>>>> upstream/main
      },
      orderBy: { createdAt: 'desc' },
    });
  }
<<<<<<< HEAD

=======
>>>>>>> upstream/main
}