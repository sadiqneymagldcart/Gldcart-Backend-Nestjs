import * as http from "http";
import { BaseSocket } from "./base.socket";
import { Socket } from "socket.io";
import { Logger } from "@utils/logger";
import { ChatConfig } from "@config/socket.config";
import { container } from "@config/inversify.config";
import { ChatService } from "@services/chat/chat.service";

class ChatSocket extends BaseSocket {
  private readonly chatService: ChatService = container.get(ChatService);

  private readonly namespace: string = ChatConfig.NAMESPACE;
  private readonly connectionEvent: string = ChatConfig.EVENTS.CONNECTION;
  private readonly newChatEvent: string = ChatConfig.EVENTS.NEW_CHAT;
  private readonly chatsEvent: string = ChatConfig.EVENTS.CHATS;

  public constructor(logger: Logger, httpServer: http.Server) {
    super(logger, httpServer);
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
        await this.handleEvents(socket);
        await this.watchNewChatEvent(socket);
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
