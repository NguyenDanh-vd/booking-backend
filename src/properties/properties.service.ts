import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { FilterPropertyDto } from './dto/filter-property.dto';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  // 0. Đếm tổng số phòng
  async countAll() {
    return this.prisma.properties.count();
  }

  // 1. Tạo phòng mới
  async create(userId: number, dto: CreatePropertyDto) {
    return this.prisma.properties.create({
      data: {
        ...dto,
        pricePerNight: Number(dto.pricePerNight),
        ownerId: userId,
      },
    });
  }

  // 2. Lấy danh sách phòng (public + filter + phân trang)
  async findAll(query: FilterPropertyDto) {
    const { search, minPrice, maxPrice, page = 1, limit = 10 } = query;

    const where: any = {
      status: 'ACTIVE',
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice || maxPrice) {
      where.pricePerNight = {};
      if (minPrice) where.pricePerNight.gte = Number(minPrice);
      if (maxPrice) where.pricePerNight.lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
      this.prisma.properties.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          owner: { select: { fullName: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.properties.count({ where }),
    ]);

    return {
      data,
      total,
      page: Number(page),
      lastPage: Math.ceil(total / Number(limit)),
    };
  }

  // 3. Xem chi tiết 1 phòng
  async findOne(id: number) {
    const property = await this.prisma.properties.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            fullName: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
      },
    });

    if (!property) throw new NotFoundException('Không tìm thấy phòng này');
    return property;
  }

  // 4. Cập nhật phòng
  async update(id: number, userId: number, dto: UpdatePropertyDto) {
    const property = await this.prisma.properties.findUnique({ where: { id } });

    if (!property) throw new NotFoundException('Phòng không tồn tại');
    if (property.ownerId !== userId) {
      throw new ForbiddenException('Bạn không có quyền sửa phòng này');
    }

    const dataToUpdate: any = { ...dto };

    if (dto.pricePerNight !== undefined) {
      dataToUpdate.pricePerNight = Number(dto.pricePerNight);
    }

    return this.prisma.properties.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  // 5. Xóa phòng
  async remove(id: number, userId: number) {
    const property = await this.prisma.properties.findUnique({ where: { id } });

    if (!property) throw new NotFoundException('Phòng không tồn tại');
    if (property.ownerId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa phòng này');
    }

    return this.prisma.properties.delete({ where: { id } });
  }

  // 6. Lấy danh sách phòng của host
  async findAllByOwner(userId: number) {
    return this.prisma.properties.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
