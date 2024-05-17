import OrderModel, { Order } from "@models/shop/order/Order";
import { Logger } from "@utils/logger";
import { inject, injectable } from "inversify";
import { BaseService } from "../base/base.service";
import { BadRequestException } from "@exceptions/bad-request.exception";

@injectable()
export class OrderService extends BaseService {
  public constructor(@inject(Logger) logger: Logger) {
    super(logger);
  }

  public async createOrder(data: Order): Promise<Order> {
    try {
      this.logger.logInfo(`Order created: ${new OrderModel(data).id}`);
      return new OrderModel(data).save();
    } catch (error: any) {
      this.logger.logError("Failed to create order", error);
      throw new BadRequestException("Failed to create order");
    }
  }

  public async getOrder(userId: string): Promise<Order | null> {
    try {
      return OrderModel.findOne({ userId }).populate({
        path: "products",
        select: { product_name: 1, price: 1 },
      });
    } catch (error: any) {
      this.logger.logError("Failed to get order", error);
      throw new BadRequestException("Failed to get order");
    }
  }

  public async updateOrder(id: string, data: any): Promise<Order | null> {
    try {
      return OrderModel.findByIdAndUpdate(
        id,
        {
          billing_details: data.billing_details,
          order_notes: data.order_notes,
        },
        { new: true },
      );
    } catch (error: any) {
      throw new BadRequestException("Failed to update order");
    }
  }
  public async updateOrderStatus(
    id: string,
    status: string,
  ): Promise<Order | null> {
    try {
      return await OrderModel.findByIdAndUpdate(id, { status }, { new: true });
    } catch (error: any) {
      this.logger.logError("Failed to update order status", error);
      throw new BadRequestException("Failed to update order status");
    }
  }
}
