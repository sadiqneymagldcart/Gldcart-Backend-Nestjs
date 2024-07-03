import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema()
export class Item {
  @Prop({ required: true, unique: true })
  itemId: string;

  @Prop({ required: true })
  stock: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
