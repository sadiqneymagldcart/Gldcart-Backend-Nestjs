import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { ItemTypes } from '@cart/enums/item-types.enum';
import { NotFoundException } from '@nestjs/common';

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
    description: 'Type of the item (e.g., product, offering, renting)',
    enum: ['product', 'offering', 'renting'],
    example: 'offering',
  })
  @Prop({
    required: true,
    enum: ItemTypes,
    index: true,
    type: String,
  })
  itemType: ItemTypes;

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

async function validateUser(userId: Types.ObjectId, userModel: any) {
  const userExists = await userModel.exists({ _id: userId });
  if (!userExists) {
    throw new NotFoundException(`User with ID ${userId} not found`);
  }
}

async function validateItems(
  items: CartItem[],
  models: Record<ItemTypes, any>,
) {
  for (const item of items) {
    const model = models[item.itemType];
    if (!model) {
      throw new NotFoundException(`Item type ${item.itemType} is invalid`);
    }

    const itemExists = await model.exists({ _id: item.itemId });
    if (!itemExists) {
      throw new NotFoundException(
        `Item with ID ${item.itemId} of type ${item.itemType} not found`,
      );
    }
  }
}

CartSchema.pre<CartDocument>('save', async function(next) {
  const userModel = this.model('User');
  const models = {
    [ItemTypes.PRODUCT]: this.model('Product'),
    [ItemTypes.OFFERING]: this.model('Offering'),
    [ItemTypes.RENTING]: this.model('Renting'),
  };

  try {
    await validateUser(this.userId, userModel);
    await validateItems(this.items, models);
    next();
  } catch (error) {
    next(error);
  }
});
