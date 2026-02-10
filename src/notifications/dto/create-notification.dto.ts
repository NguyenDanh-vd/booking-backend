<<<<<<< HEAD
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number; // Người nhận
=======
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  // 1. SỬA: Đổi từ @IsNotEmpty thành @IsOptional
  @IsOptional()
  @IsNumber()
  userId?: number; // Thêm dấu ? để TypeScript hiểu là có thể không có

  @IsOptional()
  @IsNumber()
  senderId?: number; 
>>>>>>> upstream/main

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
<<<<<<< HEAD
  type: string; // 'SYSTEM', 'BOOKING', 'PAYMENT'
=======
  type: string; 
>>>>>>> upstream/main
}