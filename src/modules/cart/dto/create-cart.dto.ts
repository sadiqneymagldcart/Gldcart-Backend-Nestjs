import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsMongoId,
  IsInt,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

class CartItemDto {
  @ApiProperty({
    description: 'ID of the product',
    example: '668177b0ac6c1a132e160a6b',
  })
  @IsNotEmpty()
  @IsMongoId()
  itemId: string;

  @ApiProperty({
    description: 'Type of the item (e.g., product, service, rental)',
    example: 'offering',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  itemType: string;

  @ApiProperty({ description: 'Quantity of the product', example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateCartDto {
  @ApiProperty({
    description: 'User ID associated with the cart',
    example: '66792047d6650afd5905252e',
  })
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
