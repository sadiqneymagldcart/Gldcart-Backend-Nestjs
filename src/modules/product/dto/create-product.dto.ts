import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CreateProductDto {
  @ApiProperty({
    description: 'The unique identifier of the seller',
    example: '66792047d6650afd5905252e',
  })
  sellerId: Types.ObjectId;

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
    description: 'Array of image URLs associated with the product',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
  })
  images: string[];

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
