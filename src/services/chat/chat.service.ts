import { inject, injectable } from "inversify";
import { Chat, ChatModel } from "../../models/chat/Chat";
import { Model } from "mongoose";

@injectable()
export class ChatService {
    private readonly chatModel: Model<Chat>;

    public constructor(@inject(ChatModel) chatModel: Model<Chat>) {
        this.chatModel = chatModel;
    }

    public async getChats(userId: string): Promise<Chat[]> {
        return this.chatModel.find({ participants: userId });
    }

    public async createChat(participants: string[]): Promise<Chat> {
        const newChat = new this.chatModel({ participants });
        return newChat.save();
    }

    public async getChatMessages(chatId: string): Promise<Chat | null> {
        const chat = await this.chatModel.findById(chatId).populate("messages");
        return chat;
    }
}
