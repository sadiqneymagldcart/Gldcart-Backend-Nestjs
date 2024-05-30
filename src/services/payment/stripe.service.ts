import { Logger } from "@utils/logger";
import Stripe from "stripe";
import { BaseService } from "../base/base.service";
import { inject, injectable } from "inversify";
import { CartItem } from "@models/shop/cart/Cart";

@injectable()
export class StripeService extends BaseService {
    private readonly stripe: Stripe;
    private readonly stripeWebhookSecret: string = process.env
        .STRIPE_WEBHOOK_SECRET as string;

    public constructor(
        @inject(Logger) logger: Logger,
        @inject(Stripe) stripe: Stripe,
    ) {
        super(logger);
        this.stripe = stripe;
    }

    public async verifyWebhook(
        signature: string,
        payload: string,
    ): Promise<Stripe.Event> {
        try {
            return this.stripe.webhooks.constructEvent(
                payload,
                signature,
                this.stripeWebhookSecret,
            );
        } catch (error: any) {
            this.logger.logError("Failed to verify webhook", error);
            throw error;
        }
    }

    public createEvent(request: any): Stripe.Event | null {
        const signature = request.headers["stripe-signature"] as
            | string
            | string[]
            | Buffer;
        try {
            return this.stripe.webhooks.constructEvent(
                request.body,
                signature,
                <string>process.env.STRIPE_WEBHOOK_SECRET,
            );
        } catch (error: any) {
            console.log(error);
            this.logger.logError("Webhook signature verification failed", error);
            return null;
        }
    }

    public async createCustomer(email: string, name: string): Promise<string> {
        try {
            const customer = await this.createCustomerWithMetadata({ email, name });
            this.logger.logInfo(`Customer created: ${customer.id}`);
            return customer.id;
        } catch (error: any) {
            this.logger.logError("Failed to create customer", error);
            throw error;
        }
    }

    public async createPaymentCheckout(paymentData: {
        userId: string;
        cartItems: CartItem[];
    }): Promise<string | null> {
        try {
            const customer = await this.createCustomerWithMetadata({
                userId: paymentData.userId,
                cart: JSON.stringify(paymentData.cartItems),
            });
            this.logger.logInfo(`Customer created: ${customer.id}`);
            const lineItems = paymentData.cartItems.map((item) => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.product.product_name,
                    },
                    unit_amount: item.product.price * 100,
                },
                quantity: item.quantity,
            }));
            const session = await this.createCheckoutSession(customer.id, lineItems);
            this.logger.logInfo(`Checkout session created: ${session.id}`);
            return session.url;
        } catch (error: any) {
            this.logger.logError("Failed to create checkout session", error);
            throw error;
        }
    }

    public async createIntent(
        amount: number,
        currency: string,
        metadata: Record<string, any>,
    ): Promise<Stripe.PaymentIntent> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: amount,
                currency: currency,
                automatic_payment_methods: {
                    enabled: true,
                },
                confirm: false,
                metadata: metadata,
            });
            this.logger.logInfo(`Payment intent created: ${paymentIntent.id}`);
            return paymentIntent;
        } catch (error: any) {
            this.logger.logError("Failed to create payment intent", error);
            throw error;
        }
    }

    private async createCustomerWithMetadata(
        metadata: Record<string, any> = {},
    ): Promise<Stripe.Customer> {
        return this.stripe.customers.create({ metadata });
    }

    private async createCheckoutSession(
        customerId: string,
        lineItems: Object[],
    ): Promise<Stripe.Checkout.Session> {
        return this.stripe.checkout.sessions.create({
            payment_method_types: ["card"],

            phone_number_collection: {
                enabled: true,
            },
            customer: customerId,
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/checkout-success`,
            cancel_url: `${process.env.CLIENT_URL}/checkout-failed`,
        });
    }
}
