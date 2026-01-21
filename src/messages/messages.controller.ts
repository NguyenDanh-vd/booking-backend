import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; // Giả sử bạn có Guard này

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // API: GET /messages/conversation/:userId
  // Lấy lịch sử chat với người dùng có ID cụ thể
  @UseGuards(JwtAuthGuard)
  @Get('conversation/:userId')
  getConversation(@Request() req, @Param('userId') otherUserId: string) {
    return this.messagesService.findConversation(req.user.id, +otherUserId);
  }
}