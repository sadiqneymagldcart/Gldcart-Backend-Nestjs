import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

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
  @ApiProperty({
    description: 'The name of the offering',
    example: 'Sample Offering',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A brief description of the offering',
    example: 'This is a sample offering',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The category of the offering',
    example: 'Category1',
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    description: 'The subcategory of the offering',
    example: 'Subcategory1',
  })
  @IsNotEmpty()
  @IsString()
  subcategory: string;

  @ApiProperty({ description: 'Attributes of the offering', type: [Attribute] })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Attribute)
  attributes: Attribute[];
}
