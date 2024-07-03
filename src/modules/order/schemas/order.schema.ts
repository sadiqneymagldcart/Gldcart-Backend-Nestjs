import { Prop, Schema } from '@nestjs/mongoose';
import { User } from '@user/schemas/user.schema';
import { Transform, Type } from 'class-transformer';
import { OrderStatus } from '@order/enums/order-status.enum';
import mongoose from 'mongoose';

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

  @Prop()
  items: string[];

  @Prop()
  total: number;

  @Prop({ enum: OrderStatus, default: OrderStatus.PLACED })
  status: OrderStatus;

  @Prop({ type: Number })
  trackNumber: number;
}
