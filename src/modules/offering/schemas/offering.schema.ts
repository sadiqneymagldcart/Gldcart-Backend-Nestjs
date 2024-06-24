import { Category } from '@category/schemas/category.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, ObjectId } from 'mongoose';

export type OfferingDocument = Offering & Document;

@Schema({ timestamps: true })
export class Offering {
    @ApiProperty({ description: 'The unique identifier of the offering' })
    @Transform(({ value }) => value.toString())
    _id: ObjectId;

    @ApiProperty({
        description: 'The name of the offering',
        example: 'Sample Offering',
    })
    @Prop({ required: true })
    name: string;

    @ApiProperty({
        description: 'A brief description of the offering',
        example: 'This is a sample offering',
    })
    @Prop()
    description?: string;

    @ApiProperty({
        description: 'Array of image URLs associated with the offering',
        example: [
            'https://example.com/image1.jpg',
            'https://example.com/image2.jpg',
        ],
    })
    @Prop({ required: true, type: [String] })
    images: string[];

    @ApiProperty({ description: 'The category of the offering', type: Category })
    @Prop({ required: true })
    category: Category;

    @ApiProperty({
        description: 'The subcategory of the offering',
        example: 'Subcategory1',
    })
    @Prop({ required: true })
    subcategory: string;

    @ApiProperty({
        description: 'Attributes of the offering',
        example: [
            { key: 'color', value: 'red' },
            { key: 'size', value: 'M' },
        ],
    })
    @Prop({ required: true, type: mongoose.SchemaTypes.Mixed })
    attributes: { key: string; value: string }[];
}

export const OfferingSchema = SchemaFactory.createForClass(Offering);

OfferingSchema.index({ name: 'text' });
OfferingSchema.index({ category: 'text' });
OfferingSchema.index({ subcategory: 'text' });
OfferingSchema.index({ 'attributes.value': 'text' });
