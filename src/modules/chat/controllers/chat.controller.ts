import { CreateChatDto } from '@chat/dto/create-chat.dto';
import { Chat } from '@chat/schemas/chat.schema';
import { ChatService } from '@chat/services/chat.service';
import { Body, Post, Controller } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SerializeWith } from '@shared/decorators/serialize.decorator';

@ApiTags('Chat')
@Controller('/chat')
@SerializeWith(Chat)
export class ChatController {
  public constructor(private readonly chatService: ChatService) { }

  @ApiOperation({ summary: 'Create chat' })
  @ApiResponse({ status: 201, type: Chat })
  @Post()
  public async createChat(@Body() chat: CreateChatDto): Promise<Chat> {
    return await this.chatService.createChat(chat);
  }
}
