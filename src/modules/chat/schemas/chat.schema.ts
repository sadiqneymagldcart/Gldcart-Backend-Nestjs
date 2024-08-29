import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User, UserDocument } from '@user/schemas/user.schema';

export type ChatDocument = Chat & mongoose.Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }],
  })
  participants: UserDocument[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

// ChatSchema.pre<ChatDocument>('save', async function (next: any) {
//   const chat = this;
//   const userIds = chat.participants.map((participant) => participant._id);
//
//   try {
//     const [usersCount, existingChat] = await Promise.all([
//       mongoose.model(User.name).countDocuments({ _id: { $in: userIds } }),
//       mongoose.model(Chat.name).findOne({
//         participants: { $all: userIds, $size: userIds.length },
//       }),
//     ]);
//
//     if (usersCount !== userIds.length) {
//       return next(new Error('One or more participants do not exist.'));
//     }
//
//     if (existingChat) {
//       return next(new Error('Chat with the same participants already exists.'));
//     }
//
//     next();
//   } catch (error) {
//     next(error);
//   }
// });
