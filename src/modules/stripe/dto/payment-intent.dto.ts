import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Metadata } from '@stripe/interfaces/metadata.interface';

export class PaymentIntentDto {
  @ApiProperty({ description: 'The amount to be paid' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'The currency of the payment' })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'Additional metadata for the payment',
    type: 'object',
  })
  @IsNotEmpty()
  metadata: Metadata;
}
