import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'The unique identifier of the seller',
    example: '668a5fb74ddcd5703f6fdba7',
  })
  seller: string;

  @ApiProperty({ description: 'The number of products in stock' })
  stock: number;

  @ApiProperty({
    description: 'The name of the product',
    example: 'Sample Product',
  })
  name: string;

  @ApiProperty({
    description: 'A brief description of the product',
    example: 'This is a sample product',
  })
  description?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    description: 'Images of the product',
  })
  @IsNotEmpty()
  images: any;

  @ApiProperty({ description: 'The category of the product' })
  category: string;

  @ApiProperty({
    description: 'The subcategory of the product',
    example: 'Subcategory1',
  })
  subcategory: string;

  @ApiProperty({
    description: 'Attributes of the product',
    example: [
      { key: 'color', value: 'red' },
      { key: 'size', value: 'M' },
    ],
  })
  attributes: { key: string; value: string }[];
}
