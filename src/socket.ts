import * as http from "http";
import { Server, Socket } from "socket.io";
import { UserModel } from "./models/user/User";
import { Logger } from "./utils/logger";
import { ChatModel } from "./models/chat/Chat";
import { Message, MessageModel } from "./models/chat/Message";

export class CustomSocket {
  private readonly logger: Logger;
  private io: Server;

  public constructor(logger: Logger, httpServer: http.Server) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL,
      },
    });
    this.logger = logger;
    this.setupChatSocket();
  }
  private async setupChatSocket() {
    this.io.of("chat").on("connection", async (socket: Socket) => {
      const userId = socket.handshake.query.userId as string;
      this.logger.logInfo("User connected", { userId });
      await this.updateUserOnlineStatus(socket, userId, true);
      await this.handleChatsList(socket, userId);
      await this.handleConnection(socket);
      await this.watchChatCollectionChanges(socket);
    });
  }

  private async watchChatCollectionChanges(socket: Socket) {
    const changeStream = ChatModel.watch();
    changeStream.on("change", async (change) => {
      let chat: any;
      if (change.operationType === "insert") {
        chat = await ChatModel.findById(change.documentKey._id).populate({
          path: "participants",
          select: { name: 1, surname: 1, type: 1, is_online: 1 },
        });
      }
      socket.emit("newChat", chat);
    });
  }

  private async updateUserOnlineStatus(
    socket: Socket,
    userId: string,
    status: boolean,
  ) {
    await UserModel.findOneAndUpdate({ _id: userId }, { is_online: status });
    socket.broadcast.emit("status", { userId, status });
  }

  private async handleConnection(socket: Socket) {
    socket.on("join", (chatId: string) => this.handleJoin(socket, chatId));
    socket.on("message", (message: Message) =>
      this.handleMessage(socket, message),
    );
    socket.on("leave", (chatId: string) => this.handleLeave(socket, chatId));
    socket.on("disconnect", () => this.handleDisconnect(socket));
  }

  private async handleJoin(socket: Socket, chatId: string) {
    try {
      this.logger.logInfo("User joined chat", { chat_id: chatId });
      const chat = await ChatModel.findById(chatId);
      if (!chat) throw new Error("Chat not found");
      socket.join(chatId);
    } catch (error) {
      this.handleError(socket, error);
    }
  }

  private async handleMessage(socket: Socket, message: Message) {
    try {
      this.logger.logInfo("Message received", message);

      const chat = await ChatModel.findById(message.chatId);
      if (!chat) throw new Error("Chat not found");

      const savedMessage = await MessageModel.create(message);
      await chat.save();
      socket.to(message.chatId as string).emit("message", savedMessage);
    } catch (error) {
      this.handleError(socket, error);
    }
  }

  private async handleChatsList(socket: Socket, userId: string) {
    try {
      this.logger.logInfo("Getting chats for user", { userId });
      const chats = await ChatModel.find({
        participants: userId,
      }).populate({
        path: "participants",
        select: { name: 1, surname: 1, type: 1, is_online: 1 },
      });
      socket.emit("chats", chats);
    } catch (error) {
      this.handleError(socket, error);
    }
  }

  private handleLeave(socket: Socket, chatId: string) {
    socket.leave(chatId);
  }

  private async handleDisconnect(socket: Socket) {
    const userId = socket.handshake.query.userId as string;
    this.logger.logInfo("User disconnected", { userId });
    await this.updateUserOnlineStatus(socket, userId, false);
  }

  private handleError(socket: Socket, error: Error) {
    this.logger.logError("Error occurred", error);
    socket.emit("error", { message: error.message });
  }
}
