import { inject, injectable } from "inversify";
import { Message, MessageModel } from "../../models/chat/Message";
import { Chat, ChatModel } from "../../models/chat/Chat";
import { BaseService } from "../base/base.service";
import { Logger } from "../../utils/logger";

@injectable()
export class MessageService extends BaseService {
  public constructor(@inject(Logger) logger: Logger) {
    super(logger);
  }
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
    await chat.save();

    return savedMessage;
  }
  public async getMessages(chatId: string): Promise<Message[]> {
    return MessageModel.find({chatId}).sort({createdAt: 1});
  }

  public async updateMessage(
    messageId: string,
    message: Message,
  ): Promise<Message | null> {
    return MessageModel.findByIdAndUpdate(messageId, message, { new: true });
  }

  public async searchMessages(query: string, userId: string) {
    try {
      const messages = await MessageModel.find({
        $or: [
          {
            text: { $regex: `^${query}`, $options: "i" },
            senderId: userId,
          },
          {
            text: { $regex: `^${query}`, $options: "i" },
            recipientId: userId,
          },
        ],
      });
      this.logger.logInfo(`Found ${messages.length} messages`);
      return messages;
    } catch (error) {
      console.log(error);
    }
  }
}
