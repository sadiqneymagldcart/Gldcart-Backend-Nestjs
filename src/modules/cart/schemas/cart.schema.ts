import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
// import { NotFoundException } from '@nestjs/common';

export type CartDocument = Cart & Document;

class CartItem {
  @ApiProperty({
    description: 'ID of the product',
    example: '668177b0ac6c1a132e160a6b',
  })
  @Transform(({ value }) => value.toString())
  @Prop({ required: true, type: Types.ObjectId })
  itemId: Types.ObjectId;

  @ApiProperty({
    description: 'Type of the item (e.g., product, service, rental)',
  })
  @Prop({ required: true })
  itemType: string;

  @ApiProperty({ description: 'Quantity of the product', example: 1 })
  @Prop({ required: true, type: Number })
  quantity: number;
}

@Schema({ timestamps: true })
export class Cart {
  @ApiProperty({
    description: 'The unique identifier of the cart',
    example: '668177b0ac6c1a132e160a6b',
  })
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'User ID associated with the cart',
    example: '66792047d6650afd5905252e',
  })
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User',
    index: true,
  })
  @Transform(({ value }) => value.toString())
  userId: Types.ObjectId;

  @ApiProperty({ description: 'Items in the cart', type: [CartItem] })
  @Prop({ required: true, type: [CartItem] })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);

// CartSchema.pre<CartDocument>('save', async function(next) {
//   const user = await this.model('User').findById(this.userId);
//   if (!user) {
//     const err = new NotFoundException('User not found');
//     return next(err);
//   }
//   next();
// });
//
// CartSchema.pre<CartDocument>('save', async function(next) {
//   for (const item of this.items) {
//     const offering = await this.model('Offering').findById(item.offeringId);
//     if (!offering) {
//       const err = new NotFoundException(
//         `Product not found: ${item.offeringId}`,
//       );
//       return next(err);
//     }
//   }
//   next();
// });
