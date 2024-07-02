import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, Types } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], index: true })
  participants: string[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
