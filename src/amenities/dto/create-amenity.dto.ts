import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAmenityDto {
  @IsNotEmpty()
  @IsString()
  name: string; // VD: Wifi tốc độ cao

  @IsOptional()
  @IsString()
  iconUrl?: string; // Icon SVG hoặc link ảnh

  @IsOptional()
  @IsString()
  type?: string; // VD: "Giải trí", "An toàn", "Cơ bản"
}