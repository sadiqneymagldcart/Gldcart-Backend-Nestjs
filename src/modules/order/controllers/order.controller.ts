import { Controller } from '@nestjs/common';
import { OrderService } from '@order/services/order.service';

@Controller('order')
export class OrderController {
  public constructor(private readonly orderService: OrderService) {}
}
