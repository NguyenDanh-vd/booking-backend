import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles, 
  Query,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FilterPropertyDto } from './dto/filter-property.dto';

@Controller('properties')
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // TẠO PHÒNG + UPLOAD NHIỀU ẢNH
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images', 5)) // Cho phép tối đa 5 ảnh
  async create(
    @Request() req,
    @Body() createPropertyDto: CreatePropertyDto,
    @UploadedFiles() files: Array<Express.Multer.File>, //  Nhận mảng file
  ) {
    // Nếu có file ảnh gửi lên
    if (files && files.length > 0) {
      // Dùng Promise.all để upload song song tất cả ảnh lên Cloudinary
      const uploadPromises = files.map((file) =>
        this.cloudinaryService.uploadFile(file),
      );
      const uploadResults = await Promise.all(uploadPromises);

      // Lấy danh sách link ảnh trả về gán vào DTO
      createPropertyDto.images = uploadResults.map(
        (result) => result.secure_url,
      );
    } else {
      createPropertyDto.images = []; // Nếu không có ảnh thì để rỗng
    }
    return this.propertiesService.create(req.user.id, createPropertyDto);
  }

  // XEM TẤT CẢ (Ai cũng xem được -> Không cần Guard)
  @Get()
  findAll(@Query() query: FilterPropertyDto) {
    return this.propertiesService.findAll(query);
  }

  // XEM CHI TIẾT (Ai cũng xem được)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(+id);
  }

  // CẬP NHẬT (Chủ nhà mới sửa được)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertiesService.update(+id, req.user.id, updatePropertyDto);
  }

  //  XÓA (Chủ nhà mới xóa được)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.propertiesService.remove(+id, req.user.id);
  }
}