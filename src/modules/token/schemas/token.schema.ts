import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@user/schemas/user.schema';
import mongoose from 'mongoose';

export type RefreshTokenDocument = refresh_token & mongoose.Document;

@Schema({ timestamps: true })
export class refresh_token {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: User;

  @Prop({ type: String, required: true })
  refresh_token: string;
}

export const RerfreshTokenSchema = SchemaFactory.createForClass(refresh_token);

RerfreshTokenSchema.index({ user: 1 });
