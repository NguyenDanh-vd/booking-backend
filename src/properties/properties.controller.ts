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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FilterPropertyDto } from './dto/filter-property.dto';

@Controller('properties')
export class PropertiesController {
  
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  // 0. ADMIN: Lấy tất cả property
  // --- ĐÃ SỬA: Thêm JwtAuthGuard vào đây ---
  @Get('/admin')
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles('ADMIN')
  getAllProperties() {
    return this.propertiesService.findAll({});
  }

  // 1. TẠO PHÒNG
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST', 'ADMIN')
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  async create(
    @Request() req,
    @Body() createPropertyDto: CreatePropertyDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    // Ép kiểu price (Form-data luôn gửi số dạng string)
    if (createPropertyDto.pricePerNight) {
      createPropertyDto.pricePerNight = Number(createPropertyDto.pricePerNight);
    }

    if (files && files.length > 0) {
      const uploadPromises = files.map((file) =>
        this.cloudinaryService.uploadFile(file),
      );
      const uploadResults = await Promise.all(uploadPromises);
      createPropertyDto.images = uploadResults.map((result) => result.secure_url);
    } else {
      createPropertyDto.images = [];
    }
    return this.propertiesService.create(req.user.id, createPropertyDto);
  }

  // 2. XEM TẤT CẢ (Public)
  @Get()
  findAll(@Query() query: FilterPropertyDto) {
    return this.propertiesService.findAll(query);
  }

  // 3. XEM NHÀ CỦA HOST
  @UseGuards(JwtAuthGuard)
  @Get('host')
  async findMyProperties(@Request() req) {
    return this.propertiesService.findAllByOwner(req.user.id);
  }

  // 4. XEM CHI TIẾT
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(+id);
  }

  // 5. CẬP NHẬT
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST', 'ADMIN')
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 10))
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    // A. Xử lý giá tiền
    const price = body.pricePerNight ? Number(body.pricePerNight) : undefined;

    // B. Xử lý logic GỘP ẢNH
    let finalImages: string[] = [];

    // 1. Lấy ảnh cũ
    if (body.existingImages) {
      if (Array.isArray(body.existingImages)) {
        finalImages = [...body.existingImages];
      } else {
        finalImages = [body.existingImages];
      }
    }

    // 2. Lấy ảnh mới
    if (files && files.length > 0) {
      const uploadPromises = files.map((file) =>
        this.cloudinaryService.uploadFile(file),
      );
      const uploadResults = await Promise.all(uploadPromises);
      const newImageUrls = uploadResults.map((result) => result.secure_url);
      finalImages = [...finalImages, ...newImageUrls];
    }

    finalImages = finalImages.flat(Infinity).filter((img) => typeof img === 'string');

    // C. Chuẩn bị dữ liệu
    const updateDto: UpdatePropertyDto = {
      ...body,
      pricePerNight: price,
      images: finalImages,
    };
    delete updateDto['existingImages'];
    
    // Lưu ý: Logic update này nên kiểm tra xem người update có phải là chủ nhà không ở Service
    return this.propertiesService.update(+id, req.user.id, updateDto);
  }

  // 6. XÓA
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST', 'ADMIN')
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.propertiesService.remove(+id, req.user.id);
  }
}