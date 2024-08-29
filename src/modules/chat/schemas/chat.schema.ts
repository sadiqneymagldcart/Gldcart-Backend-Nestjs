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

ChatSchema.pre<ChatDocument>('save', async function (next) {
  try {
    const participants = this.participants;
    const userCount = await mongoose
      .model<User & Document>(User.name)
      .countDocuments({
        _id: { $in: participants },
      });

    if (userCount !== participants.length) {
      return next(new Error('One or more participants do not exist'));
    }

    next();
  } catch (error) {
    next(error);
  }
});
