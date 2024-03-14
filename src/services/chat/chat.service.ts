import { injectable } from "inversify";
import { Chat, ChatModel } from "../../models/chat/Chat";

@injectable()
export class ChatService {
  public async getChats(userId: string): Promise<Chat[]> {
    return ChatModel.find({ participants: userId }).populate({
      path: "participants",
      select: { name: 1, surname: 1, type: 1, is_online: 1 },
    });
  }

  public async createChat(participants: string[]): Promise<Chat> {
    const chat = await ChatModel.findOne({
      participants: { $all: participants },
    });
    if (chat) return chat;
    return await ChatModel.create({ participants });
  }

  public async getChatById(chatId: string): Promise<Chat | null> {
    return ChatModel.findById(chatId);
  }
}
