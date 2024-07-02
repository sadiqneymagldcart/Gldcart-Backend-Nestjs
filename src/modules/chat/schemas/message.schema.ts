import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Chat', required: true })
  chatId: string;

  @Prop({ type: String })
  text?: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  files?: any;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  senderId: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({
  text: 1,
  senderId: 1,
});
