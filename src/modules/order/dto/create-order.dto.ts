export class CreateOrderDto {
  customer: string;
  items: string[];
  total: number;
  status: string;
}
