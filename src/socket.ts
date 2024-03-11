import { Server, Socket } from "socket.io";
import { ChatModel } from "./models/chat/Chat";
import { Message, MessageModel } from "./models/chat/Message";
import { AwsStorage } from "./storages/aws.storage";
import * as http from "http";
import { Logger } from "./utils/logger";

export class CustomSocket {
  private readonly awsStorage: AwsStorage;
  private readonly httpServer: http.Server;
  private io: Server;
  private isStarted: boolean;

  constructor(
    awsStorage: AwsStorage,
    private readonly logger: Logger,
    private readonly port: number,
  ) {
    this.awsStorage = awsStorage;
    this.httpServer = http.createServer();
    this.io = new Server(this.httpServer, {
      cors: {
        origin: "*",
      },
    });
    this.isStarted = false;
    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on("connection", (socket: Socket) => {
      this.handleConnection(socket);
    });
  }

  private async handleConnection(socket: Socket) {
    socket.on("join", (chatId: string) => this.handleJoin(socket, chatId));
    socket.on("message", (message: Message) =>
      this.handleMessage(socket, message),
    );
    socket.on("file", (data: any) => this.handleFile(socket, data));
    socket.on("leave", (chatId: string) => this.handleLeave(socket, chatId));
    socket.on("disconnect", () => this.handleDisconnect(socket));
  }

  private async handleJoin(socket: Socket, chatId: string) {
    try {
      const chat = await ChatModel.findById(chatId);
      if (!chat) throw new Error("Chat not found");
      socket.join(chatId);
      this.io.to(chatId).emit("joined", chatId);
    } catch (error) {
      this.handleError(socket, error);
    }
  }

  private async handleMessage(socket: Socket, message: Message) {
    try {
      const chat = await ChatModel.findById(message.chatId);
      if (!chat) throw new Error("Chat not found");
      const savedMessage = await MessageModel.create(message);
      this.io.to(message.chatId).emit("message", savedMessage);
    } catch (error) {
      this.handleError(socket, error);
    }
  }

  private async handleFile(socket: Socket, data: any) {
    try {
      const urls = await this.uploadFile(data.file);
      const message: Message = {
        chatId: data.chatId,
        senderId: data.senderId,
        text: `${urls[0]}`,
        recipientId: data.recipientId,
      };
      await this.saveMessageAndBroadcast(message);
    } catch (error) {
      this.handleError(socket, error);
    }
  }

  private async uploadFile(file: any): Promise<string[]> {
    return this.awsStorage.upload([file]);
  }

  private handleLeave(socket: Socket, chatId: string) {
    socket.leave(chatId);
  }

  private handleDisconnect(socket: Socket) {
    this.logger.logInfo("User disconnected");
  }

  private handleError(socket: Socket, error: Error) {
    socket.emit("error", { message: error.message });
  }

  private async saveMessageAndBroadcast(message: Message) {
    const chat = await ChatModel.findById(message.chatId);
    if (!chat) throw new Error("Chat not found");
    const savedMessage = await MessageModel.create(message);
    this.io.to(message.chatId).emit("message", savedMessage);
  }

  public start() {
    if (!this.isStarted) {
      this.httpServer.listen(this.port, () => {
        this.logger.logInfo(
          `⚡️[socket]: Socket server is running on address ${JSON.stringify(
            this.httpServer.address(),
          )}`,
        );
      });
      this.isStarted = true;
    } else {
      this.logger.logInfo("Socket server is already running.");
    }
  }
}
