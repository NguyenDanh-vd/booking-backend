import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @IsNotEmpty()
  bookingId: number;

  @IsInt()
  @Min(1)
  @Max(5) // Chỉ cho phép đánh giá từ 1 đến 5 sao
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;
}