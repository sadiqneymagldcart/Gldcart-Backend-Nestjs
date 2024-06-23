import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@user/schemas/user.schema';
import { IsNotEmpty } from 'class-validator';
import { Types, Document } from 'mongoose';

export type RefreshTokenDocument = RefreshToken & Document;

@Schema({ timestamps: true })
export class RefreshToken extends Document {
  @ApiProperty({
    description: 'The user ID associated with the token',
    type: String,
  })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @ApiProperty({
    description: 'The token value',
    type: String,
  })
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  refreshToken: string;
}

export const RerfreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
