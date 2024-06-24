import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Category } from '@category/schemas/category.schema';

class Attribute {
  @ApiProperty({ example: 'color' })
  @IsNotEmpty()
  @IsString()
  key: string;

  @ApiProperty({ example: 'red' })
  @IsNotEmpty()
  @IsString()
  value: string;
}

export class CreateOfferingDto {
  @ApiProperty({ description: 'The name of the offering' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A brief description of the offering',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Array of image URLs associated with the offering',
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty({
    description: 'The category of the offering',
    type: () => Category,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Category)
  category: Category;

  @ApiProperty({ description: 'The subcategory of the offering' })
  @IsNotEmpty()
  @IsString()
  subcategory: string;

  @ApiProperty({ description: 'Attributes of the offering' })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Attribute)
  attributes: Attribute[];
}
