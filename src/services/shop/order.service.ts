import Order from "../../models/Order";
import Stripe from "stripe";
import {IProduct} from "../../models/Product";
import {Logger} from "../../utils/logger";
import {BaseService} from "../base.service";
import {inject, injectable} from "inversify";

@injectable()
export class OrderService extends BaseService{

    constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }

    public async createOrder(customer: Stripe.Customer | Stripe.DeletedCustomer, data: Stripe.Event.Data.Object) {
        if ("metadata" in customer &&
            "customer" in data &&
            "payment_intent" in data &&
            "amount_subtotal" in data &&
            "amount_total" in data &&
            "customer_details" in data &&
            "payment_status" in data) {

            const Items = JSON.parse(customer.metadata.cart) as IProduct[];
            try {
                const newOrder = new Order({
                    userId: customer.metadata.userId,
                    customerId: data.customer,
                    paymentIntentId: data.payment_intent,
                    products: Items,
                    subtotal: data.amount_subtotal,
                    total: data.amount_total,
                    shipping: data.customer_details,
                    payment_status: data.payment_status,
                });
                const savedOrder = await newOrder.save();
                await this.logger.logInfo("Processed OrderModel:", savedOrder);
            } catch (err) {
                console.log(err);
            }
        }
    }
}
