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
import { Server, Socket } from 'socket.io';
import { TokenService } from '@token/services/token.service';
import { CreateChatDto } from '@chat/dto/create-chat.dto';
import { CreateMessageDto } from '@chat/dto/create-message.dto';
import { Events } from '@chat/enums/events.enum';
import { IChatGateway } from '@chat/interfaces/chat-gateway.interface';
import { ChatService } from '@chat/services/chat.service';
import { MessageService } from '@chat/services/message.service';

const CLIENT_URL = process.env.CLIENT_URL;

@Injectable()
@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: CLIENT_URL,
  },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, IChatGateway
{
  private readonly logger = new Logger(ChatGateway.name, {
    timestamp: true,
  });

  @WebSocketServer() server: Server;

  public constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    private readonly tokenService: TokenService,
  ) {}

  public async handleConnection(
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const accessToken = client.handshake.query.accessToken as string;
    try {
      const { _id } = await this.tokenService.verifyAccessToken(accessToken);
      client.data.userId = _id;
      this.logger.log(`User connected: ${_id}`);
      await this.handleUserStatusChange(_id, true, client);
    } catch (error) {
      this.handleError('Error handling connection', error, client);
    }
  }

  public async handleDisconnect(
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userId = this.getUserId(client);
    if (!userId) return;
    this.logger.log(`User disconnected: ${userId}`);
    try {
      await this.handleUserStatusChange(userId, false, client);
    } catch (error) {
      this.handleError('Error handling disconnection', error, client);
    }
  }

  @SubscribeMessage(Events.JOIN)
  public async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() chatId: string,
  ): Promise<void> {
    if (!chatId) {
      this.logger.warn('User tried to join a chat without chatId');
      return;
    }
    try {
      const userId = this.getUserId(client);
      client.join(chatId);
      // socket.emit(Events.JOIN_ACK, { message: 'Successfully joined chat' });
      this.server.to(chatId).emit(Events.USER_JOINED, { userId });
    } catch (error) {
      this.handleError('Error handling join', error, client);
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
    @ConnectedSocket() client: Socket,
    @MessageBody() chatId: string,
  ): Promise<void> {
    if (!chatId) {
      this.logger.warn('User requested all messages without chatId');
      return;
    }
    const messages = await this.messageService.getChatMessages(chatId);
    client.emit(Events.SEND_ALL_MESSAGES, messages);
  }

  @SubscribeMessage(Events.CREATE_CHAT)
  public async createChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() newChat: CreateChatDto,
  ): Promise<void> {
    try {
      const chat = await this.chatService.createChat(newChat);
      this.server.emit(Events.RECEIVE_CHAT, chat);
    } catch (error) {
      this.handleError('Error creating chat', error, client);
    }
  }

  @SubscribeMessage(Events.REQUEST_ALL_CHATS)
  public async requestAllChats(
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userId = this.getUserId(client);

    if (!userId) {
      this.logger.warn('User tried to request all chats without userId');
      return;
    }

    const chats = await this.chatService.getUserChats(userId);
    client.emit(Events.SEND_ALL_CHATS, chats);
  }

  @SubscribeMessage(Events.LEAVE)
  public async handleLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() chatId: string,
  ): Promise<void> {
    if (!chatId) {
      this.logger.warn('User tried to leave a chat without chatId');
      return;
    }
    try {
      const userId = this.getUserId(client);
      client.leave(chatId);
      // socket.emit(Events.LEAVE_ACK, { message: 'Successfully left chat' });
      this.server.to(chatId).emit(Events.USER_LEFT, { userId });
    } catch (error) {
      this.handleError('Error handling leave', error, client);
    }
  }

  private getUserId(client: Socket): string {
    return client.data.userId;
  }

  private async handleUserStatusChange(
    userId: string,
    isOnline: boolean,
    client: Socket,
  ): Promise<void> {
    await this.chatService.updateUserOnlineStatus(userId, isOnline);
    if (isOnline) {
      await this.requestAllChats(client);
      this.chatService.watchChatCollectionChanges(client);
    }
  }

  private handleError(message: string, error: any, client: Socket): void {
    this.logger.error(`${message}: ${error.stack}`);
    client.emit(Events.ERROR, { message: error.message });
  }
}
