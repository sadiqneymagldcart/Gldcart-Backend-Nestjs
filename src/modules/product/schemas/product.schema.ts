import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { User } from '@user/schemas/user.schema';
import mongoose from 'mongoose';

export type ProductDocument = Product & mongoose.Document;

@Schema({ timestamps: true })
export class Product {
  @Transform(({ value }) => value.toString())
  _id: string;

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

  @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
  attributes: { key: string; value: string }[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({
  name: 1,
  category: 1,
  subcategory: 1,
});
