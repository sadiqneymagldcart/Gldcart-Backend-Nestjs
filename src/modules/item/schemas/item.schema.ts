import { ItemTypes } from '@item/enums/item-types.enum';
import { Prop, Schema } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';

@Schema({ versionKey: false })
export class Item {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({
    required: true,
    enum: ItemTypes,
    type: String,
  })
  type: string;
}
