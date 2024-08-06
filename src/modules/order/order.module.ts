import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from '@product/product.module';
import { EmailService } from '@email/services/email.service';
import { InventoryService } from '@inventory/services/inventory.service';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { Order, OrderSchema } from './schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ProductModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, EmailService, InventoryService],
  exports: [OrderService],
})
export class OrderModule {}
