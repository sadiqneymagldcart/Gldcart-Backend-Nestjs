import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Type } from 'class-transformer';
import { User } from '@user/schemas/user.schema';

export type ProductDocument = Product & mongoose.Document;

@Schema({})
export class Product {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  @Type(() => User)
  seller: User;

  @Prop({ required: true, type: Number })
  stock: number;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  subcategory: string;

  @Prop()
  rating?: number;

  @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
  attributes: { key: string; value: string }[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({
  _id: 1,
  name: 1,
  category: 1,
  subcategory: 1,
});
