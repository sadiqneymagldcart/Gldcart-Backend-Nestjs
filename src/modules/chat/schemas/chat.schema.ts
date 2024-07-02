import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Document, Types } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Transform(({ value }) => value.toString())
  _id: string;

  @ApiProperty({ type: [String], required: true, example: ['user1', 'user2'] })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], index: true })
  participants: string[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
