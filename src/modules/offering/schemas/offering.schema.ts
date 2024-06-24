import { Category } from '@category/schemas/category.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import mongoose, { Document, ObjectId } from 'mongoose';

export type OfferingDocument = Offering & Document;

@Schema({ timestamps: true })
export class Offering {
    @Transform(({ value }) => value.toString())
    _id: ObjectId;

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
