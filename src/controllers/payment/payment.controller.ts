import * as express from "express";
import { StripeService } from "@services/payment/stripe.service";
import { inject } from "inversify";
import { Controller, controller, httpPost } from "inversify-express-utils";
import { StripeWebhookService } from "@services/payment/stripe-webhook.service";

@controller("/payments")
export class PaymentController implements Controller {
    private readonly stripeService: StripeService;
    private readonly stripeWebhookService: StripeWebhookService;

    public constructor(
        @inject(StripeService) paymentService: StripeService,
        @inject(StripeWebhookService) stripeWebhookService: StripeWebhookService,
    ) {
        this.stripeService = paymentService;
        this.stripeWebhookService = stripeWebhookService;
    }

    @httpPost("/create-customer")
    public async createCustomer(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ): Promise<void> {
        const { email, name } = request.body;
        try {
            const customerId = await this.stripeService.createCustomer(email, name);
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
            const checkoutUrl = await this.stripeService.createPaymentCheckout(
                request.body,
            );
            response.json({ url: checkoutUrl });
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/create-payment-intent")
    public async createPaymentIntent(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ): Promise<void> {
        const { amount, currency, metadata } = request.body;
        try {
            const intent = await this.stripeService.createIntent(
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
        try {
            const event = this.stripeWebhookService.createEvent(request);
            if (!event) {
                response.status(400).send(`Webhook Error: Invalid event`);
                return;
            }
            await this.stripeWebhookService.handleEvent(event);
        } catch (error) {
            next(error);
        }
    }
}
