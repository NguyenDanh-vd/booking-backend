import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  // QUAN TRỌNG: Thay dòng chữ 'sk_test_...' bên dưới bằng Secret Key của bạn
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2026-01-28.clover', // Hoặc phiên bản mới nhất mà VS Code gợi ý
  });

  async createPaymentIntent(amount: number) {
    // Đây là lệnh gửi sang Stripe để tạo giao dịch
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount, // Số tiền
      currency: 'vnd', // Đơn vị tiền tệ (VND)
      automatic_payment_methods: { enabled: true },
    });

    // Trả về "chìa khóa bí mật" để Frontend dùng vẽ form nhập thẻ
    return {
      clientSecret: paymentIntent.client_secret,
    };
  }
}