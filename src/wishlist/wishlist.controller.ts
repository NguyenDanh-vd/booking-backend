import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; // Sửa đường dẫn nếu cần

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  create(@Request() req, @Body('propertyId', ParseIntPipe) propertyId: number) {
    // Lưu ý: Nếu DTO của bạn phức tạp thì dùng DTO, 
    // còn nếu chỉ gửi 1 số propertyId thì dùng @Body như này cho nhanh
    return this.wishlistService.create(req.user.id, propertyId);
  }

  @Get()
  findAll(@Request() req) {
    return this.wishlistService.findAll(req.user.id);
  }

  @Get(':id/check')
  check(@Request() req, @Param('id', ParseIntPipe) propertyId: number) {
    return this.wishlistService.checkIsLiked(req.user.id, propertyId);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id', ParseIntPipe) propertyId: number) {
    return this.wishlistService.remove(req.user.id, propertyId);
  }
}