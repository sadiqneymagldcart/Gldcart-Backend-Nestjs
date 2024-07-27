import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentIntentDto {
  @ApiProperty({ description: 'The amount to be paid' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'The currency of the payment' })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({ description: 'Additional metadata for the payment' })
  @IsNotEmpty()
  @IsString()
  metadata: string;
}
