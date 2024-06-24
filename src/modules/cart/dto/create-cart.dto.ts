import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

class CartItemDto {
  @ApiProperty({ description: 'ID of the product' })
  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @ApiProperty({ description: 'Quantity of the product' })
  @IsNotEmpty()
  quantity: number;
}

export class CreateCartDto {
  @ApiProperty({ description: 'User ID associated with the cart' })
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @ApiProperty({ description: 'Items in the cart', type: [CartItemDto] })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
