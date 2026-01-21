import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { MessagesService } from '../messages.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt'; // Import JwtService
import { UnauthorizedException } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // Trong môi trường Prod nhớ chỉnh lại domain cụ thể
  },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly jwtService: JwtService, // Inject JWT để verify user
  ) {}

  // 1. XỬ LÝ KHI NGƯỜI DÙNG KẾT NỐI
  async handleConnection(client: Socket) {
    try {
      // Lấy token từ header hoặc query của socket client
      // Ví dụ Client: io("URL", { extraHeaders: { Authorization: "Bearer ..." } })
      const token = this.extractToken(client);
      
      if (!token) throw new UnauthorizedException();

      const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET // Hoặc lấy từ ConfigService
      });

      // Lưu thông tin user vào socket để dùng sau này
      client.data.user = payload;

      // JOIN ROOM RIÊNG: Ví dụ "user_1", "user_2"
      // Giúp server gửi tin nhắn đích danh cho user này
      await client.join(`user_${payload.id}`);

      console.log(`User ${payload.id} connected: ${client.id}`);
    } catch (e) {
      console.log('Connection rejected:', e.message);
      client.disconnect();
    }
  }

  // 2. XỬ LÝ KHI NGẮT KẾT NỐI
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // 3. NHẬN SỰ KIỆN "sendMessage" TỪ CLIENT
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    const senderId = client.data.user.id; // Lấy ID người gửi từ token đã verify
    const receiverId = createMessageDto.receiverId;

    // A. Lưu vào Database
    const savedMessage = await this.messagesService.create(senderId, createMessageDto);

    // B. Gửi Real-time cho người nhận (nếu họ đang online/trong room)
    // Bắn sự kiện 'newMessage' vào phòng 'user_{receiverId}'
    this.server.to(`user_${receiverId}`).emit('newMessage', savedMessage);

    // C. Gửi lại cho chính người gửi (để UI cập nhật ngay lập tức mà không cần reload)
    // client.emit('messageSent', savedMessage); 
    
    return savedMessage; // Trả về acknowledgment cho người gửi
  }

  // Helper tách token
  private extractToken(client: Socket): string | undefined {
    const [type, token] = client.handshake.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}