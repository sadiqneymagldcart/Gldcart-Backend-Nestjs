import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { User } from '@user/schemas/user.schema';
import { ItemTypes } from '@item/enums/item-types.enum';
import { Item, ItemSchema } from '@item/schemas/item.schema';
import mongoose from 'mongoose';

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
      console.log(`Item type ${item.type} is invalid or not recognized`);
      throw new NotFoundException(`Item type ${item.type} is invalid`);
    }

    const itemExists = await model.exists({ _id: item.id });
    if (!itemExists) {
      console.log(
        `Item with ID ${item.id} of type ${item.type} not found in the database`,
      );
      throw new NotFoundException(
        `Item with ID ${item.id} of type ${item.type} not found`,
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
    await validateUser(this.customer, userModel);
    await validateItems(this.items, models);
    next();
  } catch (error) {
    next(error);
  }
});
