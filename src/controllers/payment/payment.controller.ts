import * as express from "express";
import { StripeService } from "@services/payment/stripe.service";
import { inject } from "inversify";
import {
    BaseHttpController,
    controller,
    httpPost,
} from "inversify-express-utils";
import { StripeWebhookService } from "@services/payment/stripe-webhook.service";

@controller("/payments")
export class PaymentController extends BaseHttpController {
    private readonly stripeService: StripeService;
    private readonly stripeWebhookService: StripeWebhookService;

    public constructor(
        @inject(StripeService) paymentService: StripeService,
        @inject(StripeWebhookService) stripeWebhookService: StripeWebhookService,
    ) {
        super();
        this.stripeService = paymentService;
        this.stripeWebhookService = stripeWebhookService;
    }

    @httpPost("/create-customer")
    public async createCustomer(request: express.Request): Promise<void> {
        const { email, name } = request.body;
        const customerId = await this.stripeService.createCustomer(email, name);
        this.created("/payments/create-customer", customerId);
    }

    @httpPost("/create-payment-checkout")
    public async createPaymentCheckout(request: express.Request): Promise<void> {
        const checkoutUrl = await this.stripeService.createPaymentCheckout(
            request.body,
        );
        this.ok({ url: checkoutUrl });
    }

    @httpPost("/create-payment-intent")
    public async createPaymentIntent(request: express.Request): Promise<void> {
        const { amount, currency, metadata } = request.body;
        const intent = await this.stripeService.createIntent(
            amount,
            currency,
            metadata,
        );
        this.ok({ client_secret: intent.client_secret });
    }

    @httpPost("/webhook")
    public async webhook(request: express.Request): Promise<void> {
        const event = this.stripeWebhookService.createEvent(request);
        if (!event) {
            this.badRequest("Webhook Error: Invalid event");
            return;
        }
        await this.stripeWebhookService.handleEvent(event);
    }
}
