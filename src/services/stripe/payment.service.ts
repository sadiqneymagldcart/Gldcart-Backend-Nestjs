import { Logger } from "../../utils/logger";
import Stripe from "stripe";
import { Product } from "../../models/shop/product/Product";
import { BaseService } from "../base.service";
import { ICheckoutRequestBody } from "../../interfaces/ICheckoutRequestBody";
import { inject, injectable } from "inversify";

@injectable()
export class PaymentService extends BaseService {
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
        paymentData: ICheckoutRequestBody,
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

    private async createCustomerWithMetadata(
        metadata: Record<string, any> = {},
    ): Promise<Stripe.Customer> {
        return this.stripe.customers.create({ metadata });
    }

    private createLineItems(cartItems: Product[]): Array<Object> {
        return cartItems.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.product_name,
                    images: [item.images[0]],
                    description: item.short_description,
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
            shipping_address_collection: {
                allowed_countries: ["US", "UA", "SK"],
            },
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
