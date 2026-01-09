import { 
  Controller, Get, Body, Patch, UseGuards, Request, 
  UseInterceptors, UploadedFile, BadRequestException 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService // 👈 Inject Service Upload
  ) {}

  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  // 👇 API UPDATE (Kèm upload ảnh) 👇
  @Patch('profile')
  @UseInterceptors(FileInterceptor('avatar')) // 'avatar' là tên key trong Form Data
  async update(
    @Request() req, 
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File // Nhận file từ request
  ) {
    // Nếu có gửi file thì upload lên Cloudinary
    if (file) {
      const result = await this.cloudinaryService.uploadFile(file);
      updateUserDto.avatar = result.secure_url; // Lấy link ảnh gán vào DTO
    }

    return this.usersService.update(req.user.id, updateUserDto);
  }
}