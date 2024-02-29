import * as express from "express";
import { StripeService } from "../../services/stripe/payment.service";
import { inject } from "inversify";
import { controller, httpPost } from "inversify-express-utils";
import { OrderService } from "../../services/shop/order.service";

@controller("/payments")
export class PaymentController {
    private readonly paymentService: StripeService;
    private readonly orderService: OrderService;

    public constructor(
        @inject(StripeService) paymentService: StripeService,
        @inject(OrderService) orderService: OrderService,
    ) {
        this.paymentService = paymentService;
        this.orderService = orderService;
    }

    @httpPost("/create-customer")
    public async createCustomer(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ): Promise<void> {
        const { email, name } = request.body;
        try {
            const customerId = await this.paymentService.createCustomer(email, name);
            response.send(customerId);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/create-payment-checkout")
    public async createPaymentCheckout(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ): Promise<void> {
        try {
            const checkoutUrl = await this.paymentService.createPaymentCheckout(
                request.body,
            );
            response.json({ url: checkoutUrl });
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/create-payment-intent")
    public async chargeWithToken(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ): Promise<void> {
        const { amount, currency, metadata } = request.body;
        try {
            const intent = await this.paymentService.createIntent(
                amount,
                currency,
                metadata,
            );
            response.json({ client_secret: intent.client_secret });
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/webhook")
    public async webhook(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ): Promise<void> {
        const event = this.paymentService.createEvent(request);
        if (!event) {
            response.status(400).send(`Webhook Error: Invalid event`);
            return;
        }
        console.log(event.type);
        try {
            switch (event.type) {
                case "payment_intent.created":
                    console.log("Payment intent created");
                case "charge.succeeded":
                    const paymentIntent = event.data.object;
                    console.log(paymentIntent);
                    await this.orderService.updateOrderStatus(paymentIntent.id, "paid");
                    break;
                case "payment_intent.payment_failed":
                    const paymentIntentFailed = event.data.object;
                    await this.orderService.updateOrderStatus(
                        paymentIntentFailed.id,
                        "failed",
                    );
                    break;
                default:
                    break;
            }
            response.json({ received: true });
        } catch (error) {
            next(error);
        }
    }

    @httpPost("") public async() { }
}
