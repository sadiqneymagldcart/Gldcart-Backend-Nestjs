import OrderModel, { Order } from "../../models/shop/order/Order";
import Stripe from "stripe";
import { Logger } from "../../utils/logger";
import { inject, injectable } from "inversify";
import { ApiError } from "../../exceptions/api.error";
import { BaseService } from "../base/base.service";

@injectable()
export class OrderService extends BaseService {
    public constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }

    public async updateOrderStatus(
        id: string,
        status: string,
    ): Promise<Order | null> {
        try {
            return await OrderModel.findByIdAndUpdate(id, { status }, { new: true });
        } catch (error: any) {
            this.logger.logError("Failed to update order status", error);
            throw ApiError.BadRequest("Failed to update order status");
        }
    }

    public async createOrder(data: Order): Promise<Order> {
        try {
            const order = new OrderModel(data);
            this.logger.logInfo(`Order created: ${order.id}`);
            return order.save();
        } catch (error: any) {
            this.logger.logError("Failed to create order", error);
            throw ApiError.BadRequest("Failed to create order");
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
            throw ApiError.BadRequest("Failed to get order");
        }
    }

    public async updateOrder(id: string, data: any): Promise<Order | null> {
        try {
            return OrderModel.findByIdAndUpdate(id, data, { new: true });
        } catch (error: any) {
            this.logger.logError("Failed to update order", error);
            throw ApiError.BadRequest("Failed to update order");
        }
    }

    public async placeStripeOrder(data: Stripe.Event.Data.Object) {
        try {
            console.log(data);
            const order = await this.createStripeOrder(data);
            this.logger.logInfo(`Order created: ${order.id}`);
            return order;
        } catch (error: any) {
            this.logger.logError("Failed to create order", error);
            throw ApiError.BadRequest("Failed to create order");
        }
    }

    private async createStripeOrder(data: any): Promise<Order> {
        try {
            const order = new OrderModel({
                payment_id: data.id,
                amount: data.amount,
                currency: data.currency,
                status: "paid",
                customer: data.customer,
                items: data.items,
            });
            return order.save();
        } catch (error: any) {
            this.logger.logError("Failed to create order", error);
            throw ApiError.BadRequest("Failed to create order");
        }
    }
}
