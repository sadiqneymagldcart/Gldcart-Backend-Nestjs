import { Schema, SchemaFactory } from '@nestjs/mongoose';

export type StripeEventDocument = StripeEvent & Document;

@Schema({
  versionKey: false,
})
export class StripeEvent {
  _id: string;
}

export const StripeEventSchema = SchemaFactory.createForClass(StripeEvent);
