import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@user/schemas/user.schema';
import { Transform } from 'class-transformer';
import { Types, Document } from 'mongoose';

export type RefreshTokenDocument = RefreshToken & Document;

@Schema({ timestamps: true })
export class RefreshToken {
  @Transform(({ value }) => value.toString())
  _id: string;

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
  refresh_token: string;
}

export const RerfreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
