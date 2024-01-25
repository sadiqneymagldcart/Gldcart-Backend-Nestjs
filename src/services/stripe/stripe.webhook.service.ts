import Stripe from "stripe";
import {OrderService} from "../shop/order.service";
import {BaseService} from "../base.service";
import {Logger} from "../../utils/logger";

export class StripeWebhookService extends BaseService {
    private orderService: OrderService;
    private stripe: Stripe;

    constructor(logger: Logger, orderService: OrderService, stripe: Stripe) {
        super(logger);
        this.orderService = orderService;
        this.stripe = stripe;
    }

    async createEvent(request: any): Promise<Stripe.Event | null> {
        const signature = request.headers["stripe-signature"] as | string | string[] | Buffer;
        try {
            return this.stripe.webhooks.constructEvent(
                request.body,
                signature,
                <string>process.env.STRIPE_WEBHOOK_SECRET,
            );
        } catch (error: any) {
            await this.logger.logError(
                "Webhook signature verification failed",
                error,
            );
            return null;
        }
    }

    async handleEvent(event: Stripe.Event) {
        const data = event.data.object;
        const eventType: string = event.type;

        switch (eventType) {
            case "checkout.session.completed":
                try {
                    const customer = await this.stripe.customers.retrieve(
                        (data as { customer: string }).customer,
                    );
                    await this.orderService.createOrder(customer, data);
                } catch (error: any) {
                    await this.logger.logError(
                        "Error handling checkout session completion",
                        error,
                    );
                }
                break;
            default:
                await this.logger.logInfo(`Unhandled event type ${event.type}`);
                return false;
        }

        return true;
    }
}
