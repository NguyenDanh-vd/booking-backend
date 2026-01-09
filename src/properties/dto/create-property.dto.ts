import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên phòng không được để trống' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number) // Chuyển đổi chuỗi thành số nếu gửi dạng form-data
  pricePerNight: number;

  @IsString()
  @IsNotEmpty()
  address: string;

  // 2 cái này để làm bản đồ sau này (Optional)
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  latitude?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  longitude?: number;

  @IsOptional()
  images?: string[];
}