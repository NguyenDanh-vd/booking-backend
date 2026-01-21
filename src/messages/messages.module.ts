import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages/messages.gateway';
import { MessagesController } from './messages.controller'; // Nếu bạn giữ Controller cho API lấy lịch sử
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({}), // Hoặc import AuthModule nếu đã cấu hình global
  ],
  controllers: [MessagesController],
  providers: [MessagesGateway, MessagesService],
})
export class MessagesModule {}