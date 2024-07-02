import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({ type: [String], required: true, example: ['66829081894baf6d7bca705b', '668432eece23b39866f297e9']})
  participants: string[];
}
