import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '@user/schemas/user.schema';

export type ChatDocument = Chat & mongoose.Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }],
    index: true,
  })
  participants: User[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
