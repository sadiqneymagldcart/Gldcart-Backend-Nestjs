import * as http from "http";
import { BaseSocket } from "./base.socket";
import { Socket } from "socket.io";
import { Logger } from "@utils/logger";
import { ChatConfig } from "@config/socket.config";
import { container } from "@config/inversify.config";
import { ChatService } from "@services/chat/chat.service";
import { MessageService } from "@services/chat/message.service";
import { IMessage } from "@ts/interfaces/IMessage";

class ChatSocket extends BaseSocket {
  private readonly chatService: ChatService;
  private readonly messageService: MessageService;

  private readonly messageEvent: string = ChatConfig.EVENTS.MESSAGE;
  private readonly namespace: string = ChatConfig.NAMESPACE;
  private readonly connectionEvent: string = ChatConfig.EVENTS.CONNECTION;
  private readonly newChatEvent: string = ChatConfig.EVENTS.NEW_CHAT;
  private readonly chatsEvent: string = ChatConfig.EVENTS.CHATS;

  public constructor(logger: Logger, httpServer: http.Server) {
    super(logger, httpServer);
    this.chatService = container.get(ChatService);
    this.messageService = container.get(MessageService);
    this.setupSocket();
  }

  protected setupSocket() {
    this.io
      .of(this.namespace)
      .on(this.connectionEvent, async (socket: Socket) => {
        const userId = socket.handshake.query.userId as string;
        this.logger.logInfo("User connected", { userId });
        await this.updateUserOnlineStatus(socket, userId, true);
        await this.handleChatsList(socket, userId);
        await this.handleCommonEvents(socket);
        await this.handleChatMessage(socket);
        await this.watchNewChatEvent(socket);
      });
  }

  private async handleChatMessage(socket: Socket) {
    socket.on(this.messageEvent, (message: IMessage) => {
      try {
        this.logger.logInfo("Message received", message);
        const savedMessage = this.messageService.createMessage(message);
        socket.to(message.chatId as string).emit(this.messageEvent, savedMessage);
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

  private async handleChatsList(socket: Socket, userId: string) {
    try {
      const chats = await this.chatService.getChats(userId);
      socket.emit(this.chatsEvent, chats);
    } catch (error: any) {
      this.handleError(socket, error);
    }
  }
}
export { ChatSocket };
