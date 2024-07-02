import { Message } from '@chat/schemas/message.schema';
import { ChatService } from '@chat/services/chat.service';
import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3002, {
  namespace: 'chat',
  cors: {
    origin: process.env.CLIENT_URL,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger(ChatGateway.name);

  public constructor(private readonly chatService: ChatService) { }

  public async handleConnection(@ConnectedSocket() socket: Socket) {
    const userId = socket.handshake.query.userId as string;
    this.logger.log(`User connected: ${userId}`);
    await this.chatService.updateUserOnlineStatus(userId, true);
    await this._handleChatsList(socket, userId);
    this.chatService.watchChatCollectionChanges(socket);
  }

  public async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const userId = socket.handshake.query.userId as string;
    this.logger.log(`User disconnected: ${userId}`);
    await this.chatService.updateUserOnlineStatus(userId, false);
  }

  @SubscribeMessage('join')
  public async handleJoin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() chatId: string,
  ) {
    try {
      this.logger.log(`User joined chat: ${chatId}`);
      socket.join(chatId);
    } catch (error) {
      this._handleError(socket, error);
    }
  }

  @SubscribeMessage('send_message')
  public async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: Message,
  ) {
    try {
      this.logger.log('Message received', message);
      const savedMessage = await this.chatService.createMessage(message);
      socket.to(message.chatId as string).emit('receive_message', savedMessage);
    } catch (error) {
      this._handleError(socket, error);
    }
  }

  @SubscribeMessage('leave')
  handleLeave(@ConnectedSocket() socket: Socket, chatId: string) {
    socket.leave(chatId);
  }

  private async _handleChatsList(socket: Socket, userId: string) {
    try {
      this.logger.log(`Getting chats for user: ${userId}`);
      const chats = await this.chatService.getUserChats(userId);
      socket.emit('chats', chats);
    } catch (error) {
      this._handleError(socket, error);
    }
  }

  private _handleError(socket: Socket, error: Error) {
    this.logger.error('Error occurred', error.stack);
    socket.emit('error', { message: error.message });
  }
}
