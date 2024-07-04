import { Prop, Schema } from '@nestjs/mongoose';
import { User } from '@user/schemas/user.schema';
import { Transform, Type } from 'class-transformer';
import { OrderStatus } from '@order/enums/order-status.enum';
import mongoose from 'mongoose';
import { Item } from '@item/schemas/item.schema';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Order {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  @Type(() => User)
  customer: User;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  ])
  @Type(() => Item)
  items: Item[];

  @Prop({ required: true, default: 0.0 })
  total: number;

  @Prop({ default: 0.0 })
  discount: number;

  @Prop({ enum: OrderStatus, default: OrderStatus.PLACED })
  status: OrderStatus;

  @Prop({ type: Number, required: true })
  trackNumber: number;
}
