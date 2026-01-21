import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; 

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  // 1. Thêm vào yêu thích
  async create(userId: number, propertyId: number) {
    // Kiểm tra xem đã like chưa
    const existing = await this.prisma.wishlist.findFirst({
      where: { userId, propertyId },
    });

    if (existing) {
      throw new ConflictException('Bạn đã thích chỗ nghỉ này rồi');
    }

    return this.prisma.wishlist.create({
      data: {
        userId,
        propertyId,
      },
    });
  }

  // 2. Lấy danh sách yêu thích
  async findAll(userId: number) {
    const wishlists = await this.prisma.wishlist.findMany({
      where: { userId },
      include: {
        property: {
            include: {
                // Nếu bạn muốn lấy luôn ảnh hoặc các quan hệ khác của Property thì thêm vào đây
                // Ví dụ nếu images là mảng string[] thì Prisma tự lấy rồi, không cần include
            }
        } 
      },
      orderBy: { createdAt: 'desc' },
    });

    // Frontend cần mảng Property[], nên ta map ra
    return wishlists.map((item) => item.property);
  }

  // 3. Xóa khỏi yêu thích
  async remove(userId: number, propertyId: number) {
    // Dùng deleteMany để xóa dựa trên userId và propertyId
    // (Vì ta không gửi wishlistId từ frontend lên)
    const deleteResult = await this.prisma.wishlist.deleteMany({
      where: {
        userId,
        propertyId,
      },
    });

    if (deleteResult.count === 0) {
      throw new NotFoundException('Không tìm thấy trong danh sách yêu thích');
    }

    return { message: 'Đã xóa thành công' };
  }

  // 4. Kiểm tra đã like chưa
  async checkIsLiked(userId: number, propertyId: number) {
    const count = await this.prisma.wishlist.count({
      where: { userId, propertyId },
    });
    return { isLiked: count > 0 };
  }
}