import { NotFoundException } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '@user/schemas/user.schema';
import { OrderStatus } from '@order/enums/order-status.enum';
import { Item } from '@item/schemas/item.schema';
import { PaymentMethod } from '@order/enums/payment-method';

export type OrderDocument = Order & mongoose.Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Order {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  customer: User;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  ])
  items: Item[];

  @Prop({ enum: PaymentMethod })
  payment_method: PaymentMethod;

  @Prop({ required: true, default: 0.0 })
  amount: number;

  @Prop({ enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop({ type: Number })
  track_number: number;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  billing_details: any;

  @Prop({ type: String })
  order_notes?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

async function validateUser(user: User, userModel: any) {
  const userExists = await userModel.exists({ _id: user });
  if (!userExists) {
    throw new NotFoundException(`User with ID ${user} not found`);
  }
}

OrderSchema.pre<OrderDocument>('save', async function (next) {
  const userModel = this.model('User');
  try {
    await validateUser(this.customer, userModel);
    next();
  } catch (error) {
    next(error);
  }
});
