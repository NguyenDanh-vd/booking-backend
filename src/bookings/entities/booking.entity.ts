import { BookingStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class Booking {
  id: number;
  checkIn: Date;
  checkOut: Date;
  totalPrice: Decimal;
  status: BookingStatus;
  guestId: number;
  propertyId: number;
  createdAt: Date;

  // Nếu bạn muốn định nghĩa thêm các quan hệ để hiển thị ở Frontend
  property?: any; 
  guest?: any;
}