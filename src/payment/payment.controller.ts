import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // Đây là cánh cửa: Frontend sẽ gửi yêu cầu POST vào đường dẫn này
  @Post('create-intent')
  create(@Body() body: { amount: number }) {
    // Nhận số tiền từ Frontend và chuyển cho Service xử lý
    return this.paymentService.createPaymentIntent(body.amount);
  }
}