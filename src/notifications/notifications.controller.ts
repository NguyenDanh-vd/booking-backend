import {
  Controller,
  Get,
<<<<<<< HEAD
=======
  Post,
>>>>>>> upstream/main
  Patch,
  Param,
  UseGuards,
  Request,
<<<<<<< HEAD
=======
  Body,
>>>>>>> upstream/main
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
<<<<<<< HEAD

@Controller('notifications')
@UseGuards(JwtAuthGuard) 
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
=======
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  // ADMIN: Tạo thông báo mới
  @Post('/admin')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  createNotification(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(dto);
  }
>>>>>>> upstream/main

  // ADMIN: Lấy tất cả notification
  @Get('/admin')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  getAllNotifications() {
    return this.notificationsService.findAll();
  }

  // USER: Lấy thông báo của tôi
  @Get()
  findMy(@Request() req) {
    return this.notificationsService.findAllByUser(req.user.id);
  }

  // USER: Đánh dấu đã đọc
  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(+id);
  }
}
