import { CreateMessageDto } from '@chat/dto/create-message.dto';
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
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
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
      throw new WsException(error.message);
    }
  }

  @SubscribeMessage('send_message')
  public async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: CreateMessageDto,
  ) {
    try {
      this.logger.log('Message received', message);
      const savedMessage = await this.chatService.createMessage(message);
      socket.to(message.chatId as string).emit('receive_message', savedMessage);
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  @SubscribeMessage('leave')
  handleLeave(
    @ConnectedSocket() socket: Socket,
    @MessageBody() chatId: string,
  ) {
    this.logger.log(`User left chat: ${chatId}`);
    socket.leave(chatId);
  }

  private async _handleChatsList(socket: Socket, userId: string) {
    try {
      this.logger.log(`Getting chats for user: ${userId}`);
      const chats = await this.chatService.getUserChats(userId);
      socket.emit('chats', chats);
    } catch (error) {
      throw new WsException(error.message);
    }
  }
}
