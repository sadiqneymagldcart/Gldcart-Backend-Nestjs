import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Subcategory } from './subcategory.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @ApiProperty({
    type: String,
    description: 'The unique identifier of the category',
  })
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @ApiProperty({
    type: String,
    description: 'The name of the category',
    required: true,
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    type: [String],
    description: 'The subcategories linked to this category',
  })
  @Prop([{ type: Types.ObjectId, ref: 'Subcategory' }])
  @Type(() => Subcategory)
  subcategories: Subcategory[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
