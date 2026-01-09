import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { FilterPropertyDto } from './dto/filter-property.dto';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  // Tạo phòng mới (Cần userId để biết ai là chủ)
  async create(userId: number, dto: CreatePropertyDto) {
    return this.prisma.properties.create({
      data: {
        ...dto,
        ownerId: userId, // Gán chủ sở hữu
      },
    });
  }

  // Lấy danh sách tất cả phòng (Public)
  async findAll(query: FilterPropertyDto) {
    const { search, minPrice, maxPrice, page = 1, limit = 10 } = query;

    // Xây dựng điều kiện lọc (Where Clause)
    const where: any = {};

    // Nếu có từ khóa tìm kiếm
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } }, // Tìm trong tên (không phân biệt hoa thường)
        { address: { contains: search, mode: 'insensitive' } }, // Tìm trong địa chỉ
      ];
    }

    // Nếu có lọc giá
    if (minPrice || maxPrice) {
      where.pricePerNight = {};
      if (minPrice) where.pricePerNight.gte = minPrice; // Lớn hơn hoặc bằng
      if (maxPrice) where.pricePerNight.lte = maxPrice; // Nhỏ hơn hoặc bằng
    }

    // Tính toán phân trang
    const skip = (page - 1) * limit;

    // Thực hiện truy vấn
    const [data, total] = await Promise.all([
      this.prisma.properties.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          owner: { select: { fullName: true, avatar: true } }, // Kèm thông tin chủ
          amenities: { include: { amenity: true } }, // Kèm tiện ích (nếu có)
        },
        orderBy: { createdAt: 'desc' }, // Phòng mới nhất lên đầu
      }),
      this.prisma.properties.count({ where }), // Đếm tổng số lượng kết quả
    ]);

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  // Xem chi tiết 1 phòng
  async findOne(id: number) {
    const property = await this.prisma.properties.findUnique({
      where: { id },
      include: {
        owner: { select: { fullName: true, email: true, phone: true } },
      },
    });
    if (!property) throw new NotFoundException('Không tìm thấy phòng này');
    return property;
  }

  // Cập nhật phòng (Chỉ chủ nhà mới được sửa)
  async update(id: number, userId: number, dto: UpdatePropertyDto) {
    // Check xem phòng có tồn tại và đúng chủ không
    const property = await this.prisma.properties.findUnique({ where: { id } });
    
    if (!property) throw new NotFoundException('Phòng không tồn tại');
    if (property.ownerId !== userId) {
      throw new ForbiddenException('Bạn không có quyền sửa phòng này');
    }

    return this.prisma.properties.update({
      where: { id },
      data: dto,
    });
  }

  // Xóa phòng
  async remove(id: number, userId: number) {
    const property = await this.prisma.properties.findUnique({ where: { id } });
    
    if (!property) throw new NotFoundException('Phòng không tồn tại');
    if (property.ownerId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa phòng này');
    }

    return this.prisma.properties.delete({ where: { id } });
  }
}