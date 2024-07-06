import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@user/schemas/user.schema';
import mongoose from 'mongoose';

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
