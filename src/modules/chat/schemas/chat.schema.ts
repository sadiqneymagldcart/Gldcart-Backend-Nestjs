import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@user/schemas/user.schema';
import { Transform, Type } from 'class-transformer';
import mongoose from 'mongoose';

export type ChatDocument = Chat & mongoose.Document;

@Schema({ timestamps: true })
export class Chat {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }],
    index: true,
  })
  @Type(() => User)
  participants: User;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
