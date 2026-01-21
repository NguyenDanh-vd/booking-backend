import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number; // Người nhận

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  type: string; // 'SYSTEM', 'BOOKING', 'PAYMENT'
}