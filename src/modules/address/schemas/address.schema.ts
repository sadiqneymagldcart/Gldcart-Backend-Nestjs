import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import mongoose from 'mongoose';

export type AddressDocument = Address & mongoose.Document;

@Schema()
export class Address {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  postalCode: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
