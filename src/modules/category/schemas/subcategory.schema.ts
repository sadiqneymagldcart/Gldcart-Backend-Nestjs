import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SubcategoryDocument = Subcategory & Document;

@Schema({ timestamps: true })
export class Subcategory extends Document {
  @Prop({ required: true })
  name: string;
}

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);
