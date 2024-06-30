import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import mongoose from 'mongoose';

export type CartDocument = Cart & mongoose.Document;

class CartItem {
  @ApiProperty({
    description: 'ID of the product',
    example: '668177b0ac6c1a132e160a6b',
  })
  @Transform(({ value }) => value.toString())
  @Prop({ required: true, type: mongoose.Types.ObjectId })
  productId: mongoose.Types.ObjectId;

  @ApiProperty({ description: 'Quantity of the product', example: 1 })
  @Prop({ required: true, type: Number })
  @IsInt()
  @Min(1)
  quantity: number;
}

@Schema({ timestamps: true })
export class Cart {
  @ApiProperty({
    description: 'The unique identifier of the cart',
    example: '668177b0ac6c1a132e160a6b',
  })
  @Transform(({ value }) => value.toString())
  _id: mongoose.Types.ObjectId;

  @ApiProperty({
    description: 'User ID associated with the cart',
    example: '66792047d6650afd5905252e',
  })
  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: 'User',
    index: true,
  })
  @Transform(({ value }) => value.toString())
  userId: mongoose.Types.ObjectId;

  @ApiProperty({ description: 'Items in the cart', type: [CartItem] })
  @Prop({ required: true, type: [CartItem] })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
