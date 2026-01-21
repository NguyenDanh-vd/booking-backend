import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 0. Đếm tổng số user
  async countAll() {
    return this.prisma.user.count();
  }

  // 1. Lấy thông tin chi tiết user
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    const { password, ...result } = user;
    return result;
  }

  // 2. Cập nhật thông tin user
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto },
    });

    const { password, ...result } = user;
    return result;
  }

  // 3. ADMIN: đổi role
  async updateRole(
    id: number,
    role: 'GUEST' | 'HOST' | 'ADMIN',
    currentUser?: { id: number; role: string },
  ) {
    if (currentUser && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Chỉ ADMIN mới được đổi vai trò người dùng!');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: { role },
    });

    const { password, ...result } = user;
    return result;
  }

  // 4. ADMIN: lấy danh sách user
  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map(({ password, ...rest }) => rest);
  }
}
