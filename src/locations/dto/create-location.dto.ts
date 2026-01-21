import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsNotEmpty()
  @IsString()
  name: string; // Tên địa điểm (VD: Đà Lạt)

  @IsOptional()
  @IsString()
  image?: string; // Link ảnh đại diện (Upload qua Cloudinary rồi paste link vào đây)

  @IsOptional()
  @IsString()
  description?: string;
}