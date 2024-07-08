import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type OfferingDocument = Offering & mongoose.Document;

@Schema({ timestamps: true })
export class Offering {
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

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  attributes: { key: string; value: string }[];
}

export const OfferingSchema = SchemaFactory.createForClass(Offering);

OfferingSchema.index({
  name: 'text',
  category: 'text',
  description: 'text',
  subcategory: 'text',
});
