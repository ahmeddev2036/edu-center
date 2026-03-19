import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/messages' })
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;
  private readonly logger = new Logger(MessagesGateway.name);

  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
    const message = await this.messagesService.create(payload);
    // بث الرسالة لكل المتصلين
    this.server.emit('newMessage', message);
    return message;
  }

  @SubscribeMessage('markRead')
  async handleMarkRead(@MessageBody() id: string) {
    await this.messagesService.markRead(id);
    this.server.emit('messageRead', { id });
  }

  // بث رسالة جديدة من الـ REST endpoint
  broadcastMessage(message: any) {
    this.server.emit('newMessage', message);
  }
}
