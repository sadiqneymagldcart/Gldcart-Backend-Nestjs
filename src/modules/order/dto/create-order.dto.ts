import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '@user/schemas/user.schema';
import { OrderStatus } from '@order/enums/order-status.enum';
import { Item } from '@item/schemas/item.schema';

export class CreateOrderDto {
  @IsNotEmpty()
  @Type(() => User)
  customer: User;

  @IsArray()
  @IsNotEmpty()
  @Type(() => Item)
  items: Item[];

  @IsNumber()
  @IsOptional()
  total: number;

  @IsNumber()
  @IsOptional()
  discount: number;

  @IsEnum(OrderStatus)
  @IsOptional()
  status: OrderStatus;

  @IsNumber()
  @IsNotEmpty()
  trackNumber: number;
}
