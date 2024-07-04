import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@user/schemas/user.schema';
import { Product } from '@product/schemas/product.schema';
import mongoose from 'mongoose';

export type ReviewDocument = Review & mongoose.Document;

@Schema({ timestamps: true })
export class Review {
  @ApiProperty({ description: 'The unique identifier of the review' })
  @Transform(({ value }) => value.toString())
  _id: string;

  @ApiProperty({ description: 'User ID who created the review' })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  @Type(() => User)
  user: User;

  @ApiProperty({ description: 'Product ID that the review is for' })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: Product.name,
  })
  @Type(() => User)
  product: Product;

  @ApiProperty({ description: 'Rating given by the user' })
  @Prop({ required: true })
  rating: number;

  @ApiProperty({ description: 'Text content of the review' })
  @Prop({ required: true })
  comment: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
