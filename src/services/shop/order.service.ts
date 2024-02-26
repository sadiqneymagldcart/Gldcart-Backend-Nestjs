import OrderModel, { Order } from "../../models/shop/order/Order";
import Stripe from "stripe";
import { Logger } from "../../utils/logger";
import { BaseService } from "../base.service";
import { inject, injectable } from "inversify";

@injectable()
export class OrderService extends BaseService {
    public constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }

    public async createOrder(data: Order): Promise<Order> {
        try {
            const order = new OrderModel(data);
            return order.save();
        } catch (error: any) {
            this.logger.logError("Failed to create order", error);
            throw error;
        }
    }

    public async getOrder(id: string): Promise<Order | null> {
        try {
            return OrderModel.findById(id);
        } catch (error: any) {
            this.logger.logError("Failed to get order", error);
            throw error;
        }
    }

    public async updateOrder(id: string, data: any): Promise<Order | null> {
        try {
            return OrderModel.findByIdAndUpdate(id, data, { new: true });
        }
        catch (error: any) {
            this.logger.logError("Failed to update order", error);
            throw error;
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
            throw error;
        }
    }
    //
    private async createStripeOrder(data: any): Promise<Order> {
        const order = new OrderModel({
            customerId: data.customer,
            paymentId: data.id,
            amount: data.amount_total,
            currency: data.currency,
            status: data.status,
        });
        return order.save();
    }
}
