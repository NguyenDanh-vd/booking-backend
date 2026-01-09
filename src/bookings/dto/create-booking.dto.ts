import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsNumber()
  propertyId: number;

  @IsNotEmpty()
  @IsDateString() // Bắt buộc định dạng ngày tháng (YYYY-MM-DD)
  checkIn: string;

  @IsNotEmpty()
  @IsDateString()
  checkOut: string;
}