import { injectable } from "inversify";
import { Message, MessageModel } from "../../models/chat/Message";
import { Chat, ChatModel } from "../../models/chat/Chat";

@injectable()
export class MessageService {
  public async createMessage(message: Message): Promise<Message> {
    let chat: Chat | null = null;

    if (!message.chatId) {
      chat = await ChatModel.create({
        participants: [message.senderId, message.recipientId],
        messages: [],
      });
      message.chatId = chat._id;
    } else {
      chat = await ChatModel.findById(message.chatId);
      if (!chat) throw new Error("Chat not found");
    }

    const savedMessage = await MessageModel.create(message);

    chat.messages.push(savedMessage._id);
    await chat.save();

    return savedMessage;
  }
  public async getMessages(chatId: string): Promise<Message[]> {
    return await MessageModel.find({ chatId }).sort({ createdAt: 1 });
  }

  public async updateMessage(
    messageId: string,
    message: Message,
  ): Promise<Message | null> {
    return MessageModel.findByIdAndUpdate(messageId, message, { new: true });
  }
}
