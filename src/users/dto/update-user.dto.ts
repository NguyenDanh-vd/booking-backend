import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional() // Không bắt buộc gửi
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  avatar?: string; // Tạm thời là string url, sau này sẽ upload file
  @IsOptional()
  @IsString()
  role?: 'GUEST' | 'HOST' | 'ADMIN';
}