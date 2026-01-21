import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  bookingId: number;

  @IsNotEmpty()
  @IsString()
  provider: string; // VD: 'VNPAY', 'STRIPE', 'CASH'
}