import { injectable } from "inversify";
import { Message, MessageModel } from "../../models/chat/Message";

@injectable()
export class MessageService {
  public async createMessage(message: Message): Promise<Message> {
    return await MessageModel.create(message);
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
