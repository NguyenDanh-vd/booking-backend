import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard) 
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

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
