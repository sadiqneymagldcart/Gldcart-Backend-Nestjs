import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@user/schemas/user.schema';
import mongoose from 'mongoose';

export type RefreshTokenDocument = RefreshToken & mongoose.Document;

@Schema({ timestamps: true })
export class RefreshToken {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: User;

  @Prop({ type: String, required: true })
  refresh_token: string;
}

export const RerfreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

RerfreshTokenSchema.index({ user: 1 });
