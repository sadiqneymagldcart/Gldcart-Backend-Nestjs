import { IsNumber, IsString } from 'class-validator';

export class PaymentIntentDto {
  amount: number;

  currency: string;

  orderId: string;
}
