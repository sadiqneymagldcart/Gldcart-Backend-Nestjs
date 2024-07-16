import { CreateMessageDto } from '@chat/dto/create-message.dto';
import { Message, MessageDocument } from '@chat/schemas/message.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MessageService {
  public constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  public async createMessage(message: CreateMessageDto): Promise<Message> {
    return await this.messageModel.create(message);
  }

  public async getChatMessages(chat_id: string): Promise<Message[]> {
    return this.messageModel.find({ chat: chat_id }).lean();
  }
}
