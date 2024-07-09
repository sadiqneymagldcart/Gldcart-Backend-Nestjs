 import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';
import { OrderStatus } from '@order/enums/order-status.enum';

export class CreateOrderDto {
  @IsNotEmpty()
  customer: string;

  @IsArray()
  @IsNotEmpty()
  items: string[];

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
