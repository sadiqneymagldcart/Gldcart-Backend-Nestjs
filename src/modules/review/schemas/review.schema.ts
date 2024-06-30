import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @ApiProperty({ description: 'The unique identifier of the review' })
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @ApiProperty({ description: 'User ID who created the review' })
  @Transform(({ value }) => value.toString())
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @ApiProperty({ description: 'Product ID that the review is for' })
  @Transform(({ value }) => value.toString())
  @Prop({ type: Types.ObjectId, required: true })
  productId: Types.ObjectId;

  @ApiProperty({ description: 'Rating given by the user' })
  @Prop({ required: true })
  rating: number;

  @ApiProperty({ description: 'Text content of the review' })
  @Prop({ required: true })
  comment: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
