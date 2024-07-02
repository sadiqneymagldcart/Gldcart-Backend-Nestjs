import { CreateChatDto } from '@chat/dto/create-chat.dto';
import { UpdateChatDto } from '@chat/dto/update-chat.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  create(createChatDto: CreateChatDto) {
    return 'This action adds a new chat';
  }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
