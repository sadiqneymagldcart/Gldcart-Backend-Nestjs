import { Logger } from "../../utils/logger";
import Stripe from "stripe";
import { BaseService } from "../base.service";
import { inject, injectable } from "inversify";
import { CartItem } from "../../models/shop/cart/Cart";
import { CheckoutRequestBody } from "../../interfaces/CheckoutRequestBody";

@injectable()
export class StripeService extends BaseService {
    private readonly stripe: Stripe;

    public constructor(
        @inject(Logger) logger: Logger,
        @inject(Stripe) stripe: Stripe,
    ) {
        super(logger);
        this.stripe = stripe;
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

    public async createPaymentCheckout(
        paymentData: CheckoutRequestBody,
    ): Promise<string | null> {
        try {
            const customer = await this.createCustomerWithMetadata({
                userId: paymentData.userId,
                cart: JSON.stringify(paymentData.cartItems),
            });
            const lineItems = this.createLineItems(paymentData.cartItems);
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
    ): Promise<Stripe.PaymentIntent> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: amount,
                currency: currency,
                automatic_payment_methods: {
                    enabled: true,
                },
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

    private createLineItems(cartItems: CartItem[]): Array<Object> {
        return cartItems.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: "Product",
                    id: item.product,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));
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

    public async webhook(event: Stripe.Event): Promise<void> {
        try {
            const session = event.data.object as Stripe.Checkout.Session;
            if (session.payment_status === "paid") {
                this.logger.logInfo(`Payment received: ${session.id}`);
            }
        } catch (error: any) {
            this.logger.logError("Failed to process webhook", error);
            throw error;
        }
    }
}
