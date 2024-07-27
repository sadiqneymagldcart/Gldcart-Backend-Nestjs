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

  @Prop({ required: false, enum: PaymentMethod })
  payment_method: PaymentMethod;

  @Prop({ required: true, default: 0.0 })
  total: number;

  @Prop({ default: 0.0 })
  discount: number;

  @Prop({ enum: OrderStatus, default: OrderStatus.PLACED })
  status: OrderStatus;

  @Prop({ type: Number, required: true })
  track_number: number;

  @Prop({ type: String, required: true })
  notes?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
