import * as http from "http";
import { BaseSocket } from "./base.socket";
import { Socket } from "socket.io";
import { Logger } from "@utils/logger";
import { ChatConfig } from "@config/socket.config";
import { ChatService } from "@services/chat/chat.service";
import { MessageService } from "@services/chat/message.service";
import { IMessage } from "@models/chat/Message";
import { inject, injectable } from "inversify";

@injectable()
class ChatSocket extends BaseSocket {
  private readonly chatService: ChatService;
  private readonly messageService: MessageService;

  private readonly namespace: string = ChatConfig.NAMESPACE;
  private readonly connectionEvent: string = ChatConfig.EVENTS.CONNECTION;
  private readonly chatsListEvent: string = ChatConfig.EVENTS.CHATS;
  private readonly messageEvent: string = ChatConfig.EVENTS.MESSAGE;
  private readonly newChatEvent: string = ChatConfig.EVENTS.NEW_CHAT;

  public constructor(
    @inject(Logger) logger: Logger,
    @inject(http.Server) httpServer: http.Server,
    @inject(ChatService) chatService: ChatService,
    @inject(MessageService) messageService: MessageService,
  ) {
    super(logger, httpServer);
    this.chatService = chatService;
    this.messageService = messageService;
    this.setupSocket();
  }

  protected setupSocket() {
    this.io
      .of(this.namespace)
      .on(this.connectionEvent, async (socket: Socket) => {
        await this.handleConnection(socket);
      });
  }

  private async handleConnection(socket: Socket) {
    const userId = socket.handshake.query.userId as string;
    this.logger.logInfo("User connected", { userId });
    await this.updateUserOnlineStatus(socket, userId, true);
    await this.handleCommonEvents(socket);
    await this.handleChatsList(socket, userId);
    await this.handleChatMessage(socket);
    await this.watchNewChatEvent(socket);
  }

  private async handleChatsList(socket: Socket, userId: string) {
    try {
      const chats = await this.chatService.getChats(userId);
      socket.emit(this.chatsListEvent, chats);
    } catch (error: any) {
      this.handleError(socket, error);
    }
  }

  private async handleChatMessage(socket: Socket) {
    socket.on(this.messageEvent, (message: IMessage) => {
      try {
        this.logger.logInfo("Message received", message);
        const savedMessage = this.messageService.createMessage(message);
        socket
          .to(message.chatId as string)
          .emit(this.messageEvent, savedMessage);
      } catch (error) {
        this.handleError(socket, error as Error);
      }
    });
  }

  private async watchNewChatEvent(socket: Socket) {
    await this.chatService.watchChatCollectionChanges((chat) => {
      socket.emit(this.newChatEvent, chat);
    });
  }
}
export { ChatSocket };
