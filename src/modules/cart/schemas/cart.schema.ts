import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';
import { User } from '@user/schemas/user.schema';
import { ItemTypes } from '@item/enums/item-types.enum';
import { Item, ItemSchema } from '@item/schemas/item.schema';

export type CartDocument = Cart & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Cart {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  customer: User;

  @Prop({ type: [ItemSchema], required: true })
  items: Item[];

  @Prop({ type: Number, default: 0 })
  subtotal: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

async function validateUser(user: User, userModel: any) {
  const userExists = await userModel.exists({ _id: user });
  if (!userExists) {
    throw new NotFoundException(`User with ID ${user} not found`);
  }
}

async function validateItems(items: Item[], models: Record<ItemTypes, any>) {
  for (const item of items) {
    const model = models[item.type];
    if (!model) {
      throw new NotFoundException(`Item type ${item.type} is invalid`);
    }

    const itemExists = await model.exists({ _id: item.id });
    if (!itemExists) {
      throw new NotFoundException(
        `Item with ID ${item.id} of type ${item.type} not found`,
      );
    }
  }
}

async function getItemPrice(
  item: Item,
  models: Record<ItemTypes, any>,
): Promise<number> {
  const model = models[item.type];
  const itemData = await model.findById(item.id).select('price').exec();
  if (!itemData) {
    throw new NotFoundException(
      `Item with ID ${item.id} of type ${item.type} not found`,
    );
  }
  return itemData.price;
}

CartSchema.pre<CartDocument>('save', async function (next) {
  const userModel = this.model('User');
  const models = {
    [ItemTypes.PRODUCT]: this.model('Product'),
    [ItemTypes.OFFERING]: this.model('Offering'),
    [ItemTypes.RENTING]: this.model('Renting'),
  };

  try {
    await validateUser(this.customer, userModel);
    await validateItems(this.items, models);

    let total = 0;
    for (const item of this.items) {
      const price = await getItemPrice(item, models);
      total += price * item.quantity;
    }
    this.subtotal = total;

    next();
  } catch (error) {
    next(error);
  }
});
