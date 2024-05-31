import { inject, injectable } from "inversify";
import { BaseService } from "../base/base.service";
import { Logger } from "@utils/logger";
import { Nullable } from "@ts/types/nullable";
import { ChatModel } from "@models/chat/Chat";
import { IChat } from "@ts/interfaces/IChat";

@injectable()
export class ChatService extends BaseService {
  public constructor(@inject(Logger) logger: Logger) {
    super(logger);
  }

  public async getChats(userId: string): Promise<IChat[]> {
    return await ChatModel.find({
      participants: userId,
    }).populate({
      path: "participants",
      select: { name: 1, surname: 1, type: 1, is_online: 1 },
    });
  }

  public async deleteAllChats(): Promise<void> {
    await ChatModel.deleteMany({});
  }

  public async checkChatForUsers(users: string[]): Promise<Nullable<IChat>> {
    return ChatModel.findOne({
      participants: { $all: users },
    });
  }

  public async createChat(participants: string[]): Promise<IChat> {
    const chat = await ChatModel.findOne({
      participants: { $all: participants },
    });
    if (chat) return chat;
    this.logger.logInfo("Creating chat", { participants });
    return await ChatModel.create({ participants });
  }

  public async getChatById(chatId: string): Promise<Nullable<IChat>> {
    return ChatModel.findById(chatId);
  }

  public async watchChatCollectionChanges(onNewChat: (chat: any) => void) {
    const changeStream = ChatModel.watch();
    changeStream.on("change", async (change) => {
      if (change.operationType === "insert") {
        this.logger.logInfo("New chat created", change.documentKey._id);
        const newChat = await ChatModel.findById(
          change.documentKey._id,
        ).populate({
          path: "participants",
          select: { name: 1, surname: 1, type: 1, is_online: 1 },
        });
        onNewChat(newChat);
      }
    });
  }
}
