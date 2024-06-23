import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Subcategory } from './subcategory.schema';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: true,
  })
  subcategory: Subcategory;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
