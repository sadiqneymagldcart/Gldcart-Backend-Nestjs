import { ItemTypes } from '@cart/enums/item-types.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CartItemDto {
  @ApiProperty({
    description: 'The item ID',
    example: '60f4d9a3b6e2b2f3f8c6f6e6',
  })
  @IsNotEmpty()
  itemId: string;

  @ApiProperty({
    description: 'The item type',
    example: 'product',
    enum: ItemTypes,
  })
  @IsEnum(ItemTypes)
  type: ItemTypes;

  @ApiProperty({
    description: 'The quantity of the item',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  quantity: number;
}
