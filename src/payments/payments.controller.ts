import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
<<<<<<< HEAD
} from '@nestjs/common';
=======
  Request,
  Patch,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedUser {
  id: number;
  email: string;
  role: string;
}

interface AuthenticatedRequest extends ExpressRequest {
  user: AuthenticatedUser;
}
>>>>>>> upstream/main
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('payments')
export class PaymentsController {
<<<<<<< HEAD
  constructor(private readonly paymentsService: PaymentsService) {}

  // ADMIN: Lấy tất cả payment
  @Get('/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
=======
  constructor(private readonly paymentsService: PaymentsService) { }

  // ADMIN: Lấy tất cả payment
  @Get('/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
>>>>>>> upstream/main
  getAllPayments() {
    return this.paymentsService.findAllAdmin();
  }

  @Post()
<<<<<<< HEAD
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
=======
  @UseGuards(JwtAuthGuard)
  create(@Body() createPaymentDto: CreatePaymentDto, @Request() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.paymentsService.create(createPaymentDto, userId);
  }

  // USER: Lấy lịch sử thanh toán của mình
  @Get()
  @UseGuards(JwtAuthGuard)
  getMyPayments(@Request() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.paymentsService.findMyPayments(userId);
  }

  // HOST: Lấy payments cần xác nhận (cho properties của mình)
  @Get('host/pending')
  @UseGuards(JwtAuthGuard)
  getPendingPaymentsForHost(@Request() req: AuthenticatedRequest) {
    const hostId = req.user.id;
    return this.paymentsService.findPendingPaymentsForHost(hostId);
  }

  // HOST: Cập nhật trạng thái payment
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updatePaymentStatus(
    @Param('id') paymentId: string,
    @Body() body: { status: 'SUCCESS' | 'FAILED' | 'REFUNDED' },
    @Request() req: AuthenticatedRequest
  ) {
    const hostId = req.user.id;
    return this.paymentsService.updatePaymentStatus(+paymentId, body.status, hostId);
>>>>>>> upstream/main
  }

  @Get('booking/:id')
  findOneByBooking(@Param('id') id: string) {
    return this.paymentsService.findOneByBooking(+id);
  }
}
