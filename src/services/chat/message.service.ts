import { inject, injectable } from "inversify";
import { MessageModel } from "@models/chat/Message";
import { BaseService } from "../base/base.service";
import { Logger } from "@utils/logger";
import { IMessage } from "@ts/interfaces/IMessage";
import { Nullable } from "@ts/types/nullable";

@injectable()
export class MessageService extends BaseService {
  public constructor(@inject(Logger) logger: Logger) {
    super(logger);
  }

  public async createMessage(message: IMessage): Promise<IMessage> {
    return await MessageModel.create(message);
  }

  public async getMessages(chatId: string): Promise<IMessage[]> {
    return MessageModel.find({ chatId }).sort({ createdAt: 1 });
  }

  public async updateMessage(
    messageId: string,
    message: IMessage,
  ): Promise<Nullable<IMessage>> {
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
