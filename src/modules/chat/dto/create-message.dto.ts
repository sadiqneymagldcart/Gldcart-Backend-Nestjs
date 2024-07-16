import { IsOptional } from 'class-validator';

export class CreateMessageDto {
  chat_id: string;

  @IsOptional()
  text?: string;

  @IsOptional()
  files?: any;

  sender_id: string;
}
