import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  create(createLocationDto: CreateLocationDto) {
    return this.prisma.location.create({
      data: createLocationDto,
    });
  }

  findAll() {
    return this.prisma.location.findMany({
      include: {
        _count: { select: { properties: true } } // Đếm xem địa điểm này có bao nhiêu phòng
      }
    });
  }

  findOne(id: number) {
    return this.prisma.location.findUnique({
      where: { id },
      include: { properties: true } // Lấy luôn danh sách phòng thuộc địa điểm này
    });
  }

  update(id: number, updateLocationDto: UpdateLocationDto) {
    return this.prisma.location.update({
      where: { id },
      data: updateLocationDto,
    });
  }

  remove(id: number) {
    return this.prisma.location.delete({
      where: { id },
    });
  }
}