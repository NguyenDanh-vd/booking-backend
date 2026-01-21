import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('amenities')
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createAmenityDto: CreateAmenityDto) {
    return this.amenitiesService.create(createAmenityDto);
  }

  // Public để ai cũng xem được danh sách tiện ích
  @Get()
  findAll() {
    return this.amenitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.amenitiesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAmenityDto: UpdateAmenityDto) {
    return this.amenitiesService.update(+id, updateAmenityDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.amenitiesService.remove(+id);
  }
}