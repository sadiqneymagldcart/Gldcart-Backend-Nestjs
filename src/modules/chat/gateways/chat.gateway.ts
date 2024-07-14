import { CreateChatDto } from '@chat/dto/create-chat.dto';
import { CreateMessageDto } from '@chat/dto/create-message.dto';
import { Events } from '@chat/enums/events.enum';
import { IChatGateway } from '@chat/interfaces/chat-gateway.interface';
import { ChatService } from '@chat/services/chat.service';
import { MessageService } from '@chat/services/message.service';
import { Logger, Injectable } from '@nestjs/common';
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
import { TokenService } from '@token/services/token.service';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: process.env.CLIENT_URL,
  },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, IChatGateway {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  public constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    private readonly tokenService: TokenService,
  ) { }

  public async handleConnection(
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const accessToken = socket.handshake.query.accessToken as string;
    try {
      const { _id } = await this.tokenService.verifyAccessToken(accessToken);
      socket.data.user_id = _id;
      this.logger.log(`User connected: ${_id}`);
      await this.handleUserStatusChange(_id, true, socket);
    } catch (error) {
      this.handleError('Error handling connection', error, socket);
    }
  }

  public async handleDisconnect(
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const user_id = this.getUserId(socket);
    if (!user_id) return;
    this.logger.log(`User disconnected: ${user_id}`);
    try {
      await this.handleUserStatusChange(user_id, false, socket);
    } catch (error) {
      this.handleError('Error handling disconnection', error, socket);
    }
  }

  @SubscribeMessage(Events.JOIN)
  public async handleJoin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() chatId: string,
  ): Promise<void> {
    if (!chatId) {
      this.logger.warn('User tried to join a chat without chatId');
      return;
    }
    try {
      const user_id = this.getUserId(socket);
      socket.join(chatId);
      socket.emit(Events.JOIN_ACK, { message: 'Successfully joined chat' });
      this.server.to(chatId).emit(Events.USER_JOINED, { user_id });
    } catch (error) {
      this.handleError('Error handling join', error, socket);
    }
  }

  @SubscribeMessage(Events.SEND_MESSAGE)
  public async handleMessage(
    @MessageBody() message: CreateMessageDto,
  ): Promise<void> {
    this.logger.log('Message received', JSON.stringify(message));
    try {
      const savedMessage = await this.messageService.createMessage(message);
      this.server
        .to(message.chatId as string)
        .emit(Events.RECEIVE_MESSAGE, savedMessage);
    } catch (error) {
      this.logger.error('Error handling message', error.stack);
      throw new WsException('Failed to send message');
    }
  }

  @SubscribeMessage(Events.REQUEST_ALL_MESSAGES)
  public async requestAllMessages(
    @ConnectedSocket() socket: Socket,
    @MessageBody() chatId: string,
  ): Promise<void> {
    if (!chatId) {
      this.logger.warn('User requested all messages without chatId');
      return;
    }
    const messages = await this.messageService.getChatMessages(chatId);
    socket.emit(Events.SEND_ALL_MESSAGES, messages);
  }

  @SubscribeMessage(Events.CREATE_CHAT)
  public async createChat(
    @ConnectedSocket() socket: Socket,
    @MessageBody() newChat: CreateChatDto,
  ): Promise<void> {
    try {
      const chat = await this.chatService.createChat(newChat);
      this.server.emit(Events.RECEIVE_CHAT, chat);
    } catch (error) {
      this.handleError('Error creating chat', error, socket);
    }
  }

  @SubscribeMessage(Events.REQUEST_ALL_CHATS)
  public async requestAllChats(
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const user_id = this.getUserId(socket);

    if (!user_id) {
      this.logger.warn('User tried to request all chats without user_id');
      return;
    }

    const chats = await this.chatService.getUserChats(user_id);
    socket.emit(Events.SEND_ALL_CHATS, chats);
  }

  @SubscribeMessage(Events.LEAVE)
  public async handleLeave(
    @ConnectedSocket() socket: Socket,
    @MessageBody() chatId: string,
  ): Promise<void> {
    if (!chatId) {
      this.logger.warn('User tried to leave a chat without chatId');
      return;
    }
    try {
      const user_id = this.getUserId(socket);
      socket.leave(chatId);
      socket.emit(Events.LEAVE_ACK, { message: 'Successfully left chat' });
      this.server.to(chatId).emit(Events.USER_LEFT, { user_id });
    } catch (error) {
      this.handleError('Error handling leave', error, socket);
    }
  }

  private getUserId(socket: Socket): string {
    return socket.data.user_id;
  }

  private async handleUserStatusChange(
    user_id: string,
    isOnline: boolean,
    socket: Socket,
  ): Promise<void> {
    await this.chatService.updateUserOnlineStatus(user_id, isOnline);
    if (isOnline) {
      await this.requestAllChats(socket);
      this.chatService.watchChatCollectionChanges(socket);
    }
  }

  private handleError(message: string, error: any, socket: Socket): void {
    this.logger.error(`${message}: ${error.stack}`);
    socket.emit(Events.ERROR, { message: error.message });
  }
}
