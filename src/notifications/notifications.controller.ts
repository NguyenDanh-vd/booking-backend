import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('/admin')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  createNotification(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(dto);
  }

  @Get('/admin')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  getAllNotifications() {
    return this.notificationsService.findAll();
  }

  @Get()
  findMy(@Request() req) {
    return this.notificationsService.findAllByUser(req.user.id);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(+id);
  }
}
