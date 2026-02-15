import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async countAll() {
    return this.prisma.user.count();
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException('Nguoi dung khong ton tai');

    const { password, ...result } = user;
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto },
    });

    const { password, ...result } = user;
    return result;
  }

  async updateRole(
    id: number,
    role: 'GUEST' | 'HOST' | 'ADMIN',
    currentUser?: { id: number; role: string },
  ) {
    if (currentUser && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Chi ADMIN moi duoc doi vai tro nguoi dung!');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: { role },
    });

    const { password, ...result } = user;
    return result;
  }

  async updateVerificationStatus(
    id: number,
    isVerified: boolean,
    currentUser?: { id: number; role: string },
  ) {
    if (currentUser && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Chi ADMIN moi duoc xac thuc tai khoan!');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      throw new NotFoundException('Nguoi dung khong ton tai');
    }

    if (targetUser.role === 'ADMIN') {
      throw new ForbiddenException('Khong the thay doi xac thuc cho ADMIN');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: { isVerified },
    });

    const { password, ...result } = user;
    return result;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map(({ password, ...rest }) => rest);
  }

  async findByRole(role: 'GUEST' | 'HOST' | 'ADMIN') {
    const users = await this.prisma.user.findMany({
      where: { role },
    });
    return users.map(({ password, ...rest }) => rest);
  }
}
