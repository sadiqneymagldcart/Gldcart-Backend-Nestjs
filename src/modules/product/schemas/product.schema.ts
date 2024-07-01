import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Document, SchemaTypes, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @ApiProperty({ description: 'The unique identifier of the product' })
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'The unique identifier of the seller',
    example: '66792047d6650afd5905252e',
  })
  @Transform(({ value }) => value.toString())
  sellerId: Types.ObjectId;

  @ApiProperty({ description: 'The number of products in stock' })
  @Prop({ required: true, type: Number, index: true })
  stock: number;

  @ApiProperty({
    description: 'The name of the product',
    example: 'Sample Product',
  })
  @Prop({ required: true, index: true })
  name: string;

  @ApiProperty({
    description: 'A brief description of the product',
    example: 'This is a sample product',
  })
  @Prop()
  description?: string;

  @ApiProperty({
    description: 'Array of image URLs associated with the product',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
  })
  @Prop({ required: true, type: [String] })
  images: string[];

  @ApiProperty({ description: 'The category of the product' })
  @Prop({ required: true, index: true })
  category: string;

  @ApiProperty({
    description: 'The subcategory of the product',
    example: 'Subcategory1',
  })
  @Prop({ required: true, index: true })
  subcategory: string;

  @ApiProperty({
    description: 'Attributes of the product',
    example: [
      { key: 'color', value: 'red' },
      { key: 'size', value: 'M' },
    ],
  })
  @Prop({ required: true, type: SchemaTypes.Mixed, index: true })
  attributes: { key: string; value: string }[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
