import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { Document, Types } from 'mongoose';
import { Category } from './category.schema';
import { ApiProperty } from '@nestjs/swagger';

export type SubcategoryDocument = Subcategory & Document;

@Schema({ timestamps: true })
export class Subcategory {
  @ApiProperty({
    type: String,
    description: 'The unique identifier of the subcategory',
  })
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @ApiProperty({
    type: String,
    description: 'The name of the subcategory',
    required: true,
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    type: String,
    description: 'The category to which this subcategory belongs',
    required: true,
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  @Type(() => Category)
  category: Category;
}

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);
