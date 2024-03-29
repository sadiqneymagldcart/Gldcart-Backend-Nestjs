import * as http from "http";
import { Server, Socket } from "socket.io";
import { UserModel } from "./models/user/User";
import { CustomFile } from "./interfaces/CustomFile";
import { AwsStorage } from "./storages/aws.storage";
import { Logger } from "./utils/logger";
import { ChatModel } from "./models/chat/Chat";
import { Message, MessageModel } from "./models/chat/Message";

export class CustomSocket {
  private readonly logger: Logger;
  private readonly awsStorage: AwsStorage;
  private io: Server;

  public constructor(
    awsStorage: AwsStorage,
    logger: Logger,
    httpServer: http.Server,
  ) {
    this.awsStorage = awsStorage;
    this.io = new Server(httpServer, {
      connectionStateRecovery: {},
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
      await this.updateUserOnlineStatus(userId, true);
      await this.handleChatsList(socket, userId);
      await this.handleConnection(socket);
      await this.watchChatCollectionChanges(socket, userId);
    });
  }

  private async watchChatCollectionChanges(socket: Socket, userId: string) {
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

  private async updateUserOnlineStatus(userId: string, status: boolean) {
    await UserModel.findOneAndUpdate({ _id: userId }, { is_online: status });
    this.io.of("chat").emit("status", { userId, status });
  }

  private async handleConnection(socket: Socket) {
    socket.on("join", (chatId: string) => this.handleJoin(socket, chatId));
    socket.on("message", (message: Message) =>
      this.handleMessage(socket, message),
    );
    socket.on("file", (data: any) => this.handleFiles(socket, data));
    socket.on("leave", (chatId: string) => this.handleLeave(socket, chatId));
    socket.on("disconnect", () => this.handleDisconnect(socket));
  }

  private async handleJoin(socket: Socket, chatId: string) {
    try {
      this.logger.logInfo("User joined chat", { socketId: socket.id });
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

  private async handleFiles(socket: Socket, data: any) {
    try {
      const urls = await this.uploadFiles(data.files);
      const message = {
        chatId: data.chatId,
        senderId: data.senderId,
        text: `${urls[0]}`,
        recipientId: data.recipientId,
      };
      const savedMessage = await MessageModel.create(message);
      socket.broadcast.to(data.chatId).emit("message", savedMessage);
    } catch (error) {
      this.handleError(socket, error);
    }
  }

  private async uploadFiles(files: CustomFile[]): Promise<string[]> {
    if (!files || files.length === 0) {
      throw new Error("No files provided");
    }
    return await this.awsStorage.upload(files as Express.Multer.File[]);
  }

  private handleLeave(socket: Socket, chatId: string) {
    socket.leave(chatId);
  }

  private async handleDisconnect(socket: Socket) {
    const userId = socket.handshake.query.userId as string;
    this.logger.logInfo("User disconnected", { userId });
    await this.updateUserOnlineStatus(userId, false);
  }

  private handleError(socket: Socket, error: Error) {
    this.logger.logError("Error occurred", error);
    socket.emit("error", { message: error.message });
  }
}
