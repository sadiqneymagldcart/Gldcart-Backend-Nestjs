import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import mongoose, { Document, ObjectId } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CartDocument = Cart & Document;

class CartItem {
  @ApiProperty({ description: 'ID of the product' })
  @Transform(({ value }) => value.toString())
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  productId: ObjectId;

  @ApiProperty({ description: 'Quantity of the product' })
  @Prop({ required: true })
  quantity: number;
}

const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ timestamps: true })
export class Cart {
  @ApiProperty({ description: 'The unique identifier of the cart' })
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @ApiProperty({ description: 'User ID associated with the cart' })
  @Transform(({ value }) => value.toString())
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: ObjectId;

  @ApiProperty({ description: 'Items in the cart', type: [CartItem] })
  @Prop({ type: [CartItemSchema], required: true })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
