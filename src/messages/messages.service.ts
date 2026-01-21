import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Đảm bảo đường dẫn đúng
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  // 1. Lưu tin nhắn mới vào DB
  async create(senderId: number, dto: CreateMessageDto) {
    return this.prisma.message.create({
      data: {
        senderId: senderId,
        receiverId: dto.receiverId,
        content: dto.content,
        isRead: false,
      },
      include: {
        sender: {
          select: { id: true, fullName: true, avatar: true }, // Trả về info người gửi để hiển thị UI
        },
      },
    });
  }

  // 2. Lấy lịch sử chat giữa 2 người (Dùng cho API REST khi load trang)
  async findConversation(userId1: number, userId2: number) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      orderBy: {
        sentAt: 'asc', // Tin nhắn cũ nhất lên đầu
      },
      include: {
        sender: { select: { id: true, fullName: true, avatar: true } },
      },
    });
  }
  
  // 3. Đánh dấu đã đọc
  async markAsRead(senderId: number, receiverId: number) {
      await this.prisma.message.updateMany({
          where: {
              senderId: senderId,
              receiverId: receiverId,
              isRead: false
          },
          data: { isRead: true }
      });
  }
}