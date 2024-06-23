import { Category } from '@category/schemas/category.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type OfferingDocument = Offering & Document;

@Schema({ timestamps: true })
export class Offering extends Document {
    @Prop({ required: true })
    name: string;

    @Prop()
    description?: string;

    @Prop({ required: true, type: [String] })
    images: string[];

    @Prop({ required: true })
    category: Category;

    @Prop({ required: true })
    subcategory: string;

    @Prop({ required: true, type: mongoose.SchemaTypes.Mixed })
    attributes: { key: string; value: string }[];
}

export const OfferingSchema = SchemaFactory.createForClass(Offering);

OfferingSchema.index({ name: 'text' });
OfferingSchema.index({ category: 'text' });
OfferingSchema.index({ subcategory: 'text' });
OfferingSchema.index({ 'attributes.value': 'text' });
