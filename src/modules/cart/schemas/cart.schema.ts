import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { ItemTypes } from '@cart/enums/item-types.enum';
import { NotFoundException } from '@nestjs/common';
import { User } from '@user/schemas/user.schema';
import mongoose from 'mongoose';

export type CartDocument = Cart & mongoose.Document;

@Schema({
  _id: false,
  versionKey: false,
})
export class CartItem {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  @Transform(({ value }) => value.toString())
  itemId: string;

  @Prop({
    required: true,
    enum: ItemTypes,
    index: true,
    type: String,
  })
  itemType: string;

  @Prop({ required: true, type: Number })
  quantity: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ timestamps: true })
export class Cart {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  @Transform(({ value }) => value.toString())
  user: User;

  @Prop({ required: true, type: [CartItemSchema] })
  @Type(() => CartItem)
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);

async function validateUser(user: User, userModel: any) {
  const userExists = await userModel.exists({ _id: user });
  if (!userExists) {
    throw new NotFoundException(`User with ID ${user} not found`);
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
    await validateUser(this.user, userModel);
    await validateItems(this.items, models);
    next();
  } catch (error) {
    next(error);
  }
});
