import { CreateMessageDto } from '@chat/dto/create-message.dto';
import { Events } from '@chat/enums/events.enum';
import { ChatService } from '@chat/services/chat.service';
import { Logger, Inject, Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: process.env.CLIENT_URL,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  public constructor(
    @Inject(ChatService)
    private readonly chatService: ChatService,
  ) {}

  public async handleConnection(
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const userId = socket.handshake.query.userId as string;
    if (!userId) {
      this.logger.warn('User connected without userId');
      socket.disconnect();
      return;
    }

    this.logger.log('User connected: ' + userId);
    try {
      await Promise.all([
        this.chatService.updateUserOnlineStatus(userId, true),
        this.sendUserChatsList(socket, userId),
      ]);
      this.chatService.watchChatCollectionChanges(socket);
    } catch (error) {
      this.handleError(
        'Error handling connection for user ' + userId,
        error,
        socket,
      );
    }
  }

  public async handleDisconnect(
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const userId = socket.handshake.query.userId as string;
    this.logger.log('User disconnected: ' + userId);
    try {
      await this.chatService.updateUserOnlineStatus(userId, false);
    } catch (error) {
      this.handleError(
        'Error handling connection for user ' + userId,
        error,
        socket,
      );
    }
  }

  @SubscribeMessage(Events.JOIN)
  public handleJoin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() chatId: string,
  ): void {
    if (!chatId) {
      this.logger.warn('User tried to join a chat without chatId');
      return;
    }
    this.logger.log(`User joined chat: ${chatId}`);
    socket.join(chatId);
  }

  @SubscribeMessage(Events.SEND_MESSAGE)
  public async handleMessage(
    @MessageBody() message: CreateMessageDto,
  ): Promise<void> {
    this.logger.log('Message received', JSON.stringify(message));
    try {
      const savedMessage = await this.chatService.createMessage(message);
      this.server
        .to(message.chatId as string)
        .emit(Events.RECEIVE_MESSAGE, savedMessage);
    } catch (error) {
      this.logger.error('Error handling message', error.stack);
      throw new WsException('Failed to send message');
    }
  }

  @SubscribeMessage(Events.LEAVE)
  public handleLeave(
    @ConnectedSocket() socket: Socket,
    @MessageBody() chatId: string,
  ): void {
    if (!chatId) {
      this.logger.warn('User tried to leave a chat without chatId');
      return;
    }
    this.logger.log(`User left chat: ${chatId}`);
    socket.leave(chatId);
  }

  private async sendUserChatsList(
    socket: Socket,
    userId: string,
  ): Promise<void> {
    this.logger.log(`Getting chats for user: ${userId}`);
    try {
      const chats = await this.chatService.getUserChats(userId);
      socket.emit(Events.CHATS, chats);
    } catch (error) {
      this.handleError(`Error getting chats for user ${userId}`, error, socket);
    }
  }

  private handleError(message: string, error: any, socket: Socket): void {
    this.logger.error(message, error.stack);
    socket.disconnect();
  }
}
