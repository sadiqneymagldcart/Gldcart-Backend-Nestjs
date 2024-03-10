import { injectable } from "inversify";
import { Chat, ChatModel } from "../../models/chat/Chat";

@injectable()
export class ChatService {
    public async getChats(userId: string): Promise<Chat[]> {
        return ChatModel.find({ participants: userId });
    }

    public async createChat(participants: string[]): Promise<Chat> {
        const newChat = new ChatModel({ participants });
        return newChat.save();
    }

    public async getChatMessages(chatId: string): Promise<Chat | null> {
        const chat = await ChatModel.findById(chatId).populate("messages");
        return chat;
    }
}
