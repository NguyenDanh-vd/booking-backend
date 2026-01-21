import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // ADMIN: Lấy tất cả payment
  @Get('/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
  getAllPayments() {
    return this.paymentsService.findAllAdmin();
  }

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get('booking/:id')
  findOneByBooking(@Param('id') id: string) {
    return this.paymentsService.findOneByBooking(+id);
  }
}
