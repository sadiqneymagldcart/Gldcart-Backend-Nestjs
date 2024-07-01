import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Document, SchemaTypes, Types } from 'mongoose';

export type RentingDocument = Renting & Document;

@Schema({ timestamps: true })
export class Renting {
  @ApiProperty({ description: 'The unique identifier of the offering' })
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'The name of the offering',
    example: 'Sample Offering',
  })
  @Prop({ required: true, index: true })
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

  @ApiProperty({ description: 'The category of the offering' })
  @Prop({ required: true, index: true })
  category: string;

  @ApiProperty({
    description: 'The subcategory of the offering',
    example: 'Subcategory1',
  })
  @Prop({ required: true, index: true })
  subcategory: string;

  @ApiProperty({
    description: 'Attributes of the offering',
    example: [
      { key: 'color', value: 'red' },
      { key: 'size', value: 'M' },
    ],
  })
  @Prop({ required: true, type: SchemaTypes.Mixed, index: true })
  attributes: { key: string; value: string }[];
}

export const RentingSchema = SchemaFactory.createForClass(Renting);
