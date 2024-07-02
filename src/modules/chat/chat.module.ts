import { Module } from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { ChatGateway } from './gateways/chat.gateway';

@Module({
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
