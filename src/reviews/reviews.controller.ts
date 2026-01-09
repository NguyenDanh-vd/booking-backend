import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // VIẾT REVIEW (Phải đăng nhập)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(req.user.id, createReviewDto);
  }

  // XEM REVIEW CỦA 1 PHÒNG (Ai cũng xem được)
  // Đường dẫn sẽ là: /reviews/property/1
  @Get('property/:id')
  findAllByProperty(@Param('id') id: string) {
    return this.reviewsService.getReviewsByProperty(+id);
  }
}