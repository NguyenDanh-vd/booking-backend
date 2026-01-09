import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterPropertyDto {
  @IsOptional()
  @IsString()
  search?: string; // Tìm kiếm theo tên hoặc địa chỉ

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number; // Giá thấp nhất

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number; // Giá cao nhất

  // Phân trang
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number; // Trang số mấy (mặc định là 1)

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number; // Số lượng phòng mỗi trang (mặc định là 10)
}