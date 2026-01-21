import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';

@Injectable()
export class AmenitiesService {
  constructor(private prisma: PrismaService) {}

  create(createAmenityDto: CreateAmenityDto) {
    return this.prisma.amenity.create({
      data: createAmenityDto,
    });
  }

  findAll() {
    return this.prisma.amenity.findMany();
  }

  findOne(id: number) {
    return this.prisma.amenity.findUnique({
      where: { id },
    });
  }

  update(id: number, updateAmenityDto: UpdateAmenityDto) {
    return this.prisma.amenity.update({
      where: { id },
      data: updateAmenityDto,
    });
  }

  remove(id: number) {
    return this.prisma.amenity.delete({
      where: { id },
    });
  }
}