import { CreateChatDto } from '@chat/dto/create-chat.dto';
import { Events } from '@chat/enums/events.enum';
import { Chat, ChatDocument } from '@chat/schemas/chat.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@user/schemas/user.schema';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';

@Injectable()
export class ChatService {
  public constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
  ) {}

  public async createChat(chat: CreateChatDto): Promise<Chat> {
    return this.chatModel.create(chat);
  }

  public async updateUserOnlineStatus(
    user_id: string,
    status: boolean,
  ): Promise<void> {
    await this.userModel.findOneAndUpdate(
      { _id: user_id },
      { is_online: status },
    );
  }

  public async getUserChats(user_id: string): Promise<any> {
    return this.chatModel.find({ participants: user_id }).populate({
      path: 'participants',
      select: { name: 1, surname: 1, type: 1, is_online: 1 },
    });
  }

  public watchChatCollectionChanges(socket: Socket): void {
    const changeStream = this.chatModel.watch();
    changeStream.on('change', async (change) => {
      let chat: any;
      if (change.operationType === 'insert') {
        chat = await this.chatModel.findById(change.documentKey._id).populate({
          path: 'participants',
          select: { name: 1, surname: 1, type: 1, is_online: 1 },
        });
      }
      socket.emit(Events.NEW_CHAT, chat);
    });
  }
}
