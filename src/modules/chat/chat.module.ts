import { Module } from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { ChatGateway } from './gateways/chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { User, UserSchema } from '@user/schemas/user.schema';
import { ChatController } from './controllers/chat.controller';
import { MessageService } from './services/message.service';
import { TokenModule } from '@token/token.module';

@Module({
  imports: [
    TokenModule,
    MongooseModule.forFeature([
      {
        name: Chat.name,
        schema: ChatSchema,
      },
      {
        name: Message.name,
        schema: MessageSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, MessageService],
})
export class ChatModule { }
