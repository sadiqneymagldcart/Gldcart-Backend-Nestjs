import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export type ReviewDocument = Review & mongoose.Document;

@Schema({ timestamps: true })
export class Review {
  @ApiProperty({ description: 'The unique identifier of the review' })
  @Transform(({ value }) => value.toString())
  _id: mongoose.Schema.Types.ObjectId;

  @ApiProperty({ description: 'User ID who created the review' })
  @Transform(({ value }) => value.toString())
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @ApiProperty({ description: 'Product ID that the review is for' })
  @Transform(({ value }) => value.toString())
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  productId: mongoose.Schema.Types.ObjectId;

  @ApiProperty({ description: 'Rating given by the user' })
  @Prop({ required: true })
  rating: number;

  @ApiProperty({ description: 'Text content of the review' })
  @Prop({ required: true })
  comment: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
