import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Lấy thông tin chi tiết user
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    // Xóa password trước khi trả về
    const { password, ...result } = user;
    return result;
  }

  // Cập nhật thông tin
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto, // Tự động cập nhật các trường có trong DTO
      },
    });

    const { password, ...result } = user;
    return result;
  }
}