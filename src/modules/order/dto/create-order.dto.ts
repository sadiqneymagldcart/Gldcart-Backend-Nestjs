import { IsNotEmpty, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Item } from '@item/schemas/item.schema';

export class CreateOrderDto {
  @ApiProperty({
    description: 'The unique identifier of the customer',
    example: '66b7b3e8c32055a049b55029',
  })
  customer: string;

  @ApiProperty({
    description: 'List of item IDs',
    example: ['66b7b5a8901d3287c0cf6ea6', '66b7b6ed6ede04186f84f77b'],
  })
  @IsArray()
  @IsNotEmpty()
  items: Item[];

  @ApiProperty({
    description: 'Total amount of the order',
    example: 228.07,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Billing details of the customer',
    example: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      address: '123 Main St, Anytown, USA',
    },
  })
  @IsNotEmpty()
  billing_details: any;

  @ApiProperty({
    description: 'Notes for the order',
    example: 'Please deliver between 9 AM and 5 PM',
  })
  order_notes: any;
}
