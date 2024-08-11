import { IsOptional } from 'class-validator';

export class CreateMessageDto {
  chatId: string;

  @IsOptional()
  text?: string;

  @IsOptional()
  files?: any;

  sender_id: string;
}
