import Stripe from "stripe";
import { OrderService } from "../shop/order.service";
import { BaseService } from "../base/base.service";
import { Logger } from "@utils/logger";
import { inject, injectable } from "inversify";

@injectable()
export class StripeWebhookService extends BaseService {
    private readonly _orderService: OrderService;
    private readonly _stripe: Stripe;

    public constructor(
        @inject(Logger) logger: Logger,
        @inject(OrderService) orderService: OrderService,
        @inject(Stripe) stripe: Stripe,
    ) {
        super(logger);
        this._orderService = orderService;
        this._stripe = stripe;
    }

    public createEvent(request: any): Stripe.Event {
        const signature = request.headers["stripe-signature"] as
            | string
            | string[]
            | Buffer;
        return this._stripe.webhooks.constructEvent(
            request.body,
            signature,
            <string>process.env.STRIPE_WEBHOOK_SECRET,
        );
    }

    public async handleEvent(event: Stripe.Event) {
        const data = event.data.object;
        const eventType: string = event.type;

        switch (eventType) {
            case "checkout.session.completed":
                try {
                    await this._stripe.customers.retrieve(
                        (data as { customer: string }).customer,
                    );
                    console.log(data);
                } catch (error: any) {
                    this.logger.logError(
                        "Error handling checkout session completion",
                        error,
                    );
                }
                break;
            case "charge.succeeded":
                this.logger.logInfo("Charge succeeded");
                try {
                    await this._orderService.updateOrderStatus(
                        (data as { metadata: { order_id: string } }).metadata.order_id,
                        "paid",
                    );
                    console.log(
                        "Data is: ",
                        (data as { metadata: { order_id: string } }).metadata,
                    );
                } catch (error: any) {
                    this.logger.logError("Error handling payment intent success", error);
                }
                break;
            default:
                this.logger.logInfo(`Unhandled event type ${event.type}`);
                return false;
        }
        return true;
    }
}
