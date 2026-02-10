import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Cho phép Frontend (Next.js) kết nối từ bất kỳ đâu (hoặc điền cụ thể 'http://localhost:3000')
  },
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('Socket Gateway Initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    
    // Nếu muốn admin join room riêng:
    // client.on('join_admin_room', () => {
    //   client.join('admin_room');
    // });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Hàm này để các Service khác gọi khi muốn bắn thông báo
  sendNotificationToAdmin(notification: any) {
    // Gửi tới tất cả client đang kết nối (hoặc dùng .to('admin_room') nếu đã chia room)
    this.server.emit('new_notification', notification);
  }
}