import * as http from "http";
import { Server, Socket } from "socket.io";
import { Logger } from "@utils/logger";
import { UserModel } from "@models/user/User";
import { ServerOptions, SocketConfig } from "@config/socket.config";

abstract class BaseSocket {
  private readonly joinEvent: string = SocketConfig.EVENTS.JOIN_ROOM;
  private readonly leaveEvent: string = SocketConfig.EVENTS.LEAVE_ROOM;
  private readonly disconnectEvent: string = SocketConfig.EVENTS.DISCONNECT;

  protected readonly logger: Logger;
  protected io: Server;

  protected constructor(logger: Logger, httpServer: http.Server) {
    this.logger = logger;
    this.io = new Server(httpServer, ServerOptions);
  }

  protected abstract setupSocket(): void;

  protected async handleCommonEvents(socket: Socket) {
    socket.on(this.joinEvent, (chatId: string) =>
      this.handleJoin(socket, chatId),
    );
    socket.on(this.leaveEvent, (chatId: string) =>
      this.handleLeave(socket, chatId),
    );
    socket.on(this.disconnectEvent, () => this.handleDisconnect(socket));
  }

  protected async updateUserOnlineStatus(
    socket: Socket,
    userId: string,
    status: boolean,
  ) {
    await UserModel.findOneAndUpdate({ _id: userId }, { is_online: status });
    console.log("User status updated", { userId, status });
    socket.broadcast.emit("status", { userId, status });
  }

  protected async handleJoin(socket: Socket, chatId: string) {
    try {
      this.logger.logInfo("User joined chat", { chat_id: chatId });
      socket.join(chatId);
    } catch (error) {
      this.handleError(socket, error as Error);
    }
  }

  protected handleLeave(socket: Socket, chatId: string) {
    socket.leave(chatId);
  }

  protected async handleDisconnect(socket: Socket) {
    const userId = socket.handshake.query.userId as string;
    this.logger.logInfo("User disconnected", { userId });
    await this.updateUserOnlineStatus(socket, userId, false);
  }

  protected handleError(socket: Socket, error: Error) {
    this.logger.logError("Error occurred", error);
    socket.emit("error", { message: error.message });
  }
}
export { BaseSocket };
