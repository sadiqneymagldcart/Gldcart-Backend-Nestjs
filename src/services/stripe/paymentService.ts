import { Logger } from "../../utils/logger";

import Stripe from "stripe";
import { IProduct } from "../../models/Product";
import { BaseService } from "../baseService";
import { ICheckoutRequestBody } from "../../types/ICheckoutRequestBody";

export class PaymentService extends BaseService {
    private readonly stripe: Stripe;

    constructor(logger: Logger, stripe: Stripe) {
        super(logger);
        this.stripe = stripe;
    }

    public async createCustomer(email: string, name: string): Promise<string> {
        try {
            const customer = await this.stripe.customers.create({
                email: `${email}`,
                name: `${name}`,
                shipping: {
                    address: {
                        city: 'Brothers',
                        country: 'US',
                        line1: '27 Fredrick Ave',
                        postal_code: '97712',
                        state: 'CA',
                    },
                    name: `${name}`,
                },
                address: {
                    city: 'Brothers',
                    country: 'US',
                    line1: '27 Fredrick Ave',
                    postal_code: '97712',
                    state: 'CA',
                },
            });

            await this.logger.logInfo(`Customer created: ${customer.id}`);

            return customer.id;
        } catch (error: any) {
            await this.logger.logError('Failed to create customer', error);
            throw error;
        }
    }

    public async createPaymentCheckout(requestBody: ICheckoutRequestBody): Promise<string | null> {
        try {
            const customer = await this.stripe.customers.create({
                metadata: {
                    userId: requestBody.userId,
                    cart: JSON.stringify(requestBody.cartItems),
                },
            });

            const line_items = requestBody.cartItems.map((item: IProduct) => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.title,
                        images: [item.imageURL],
                        description: item.description,
                        // metadata: {
                        //     id: item.productId,
                        // },
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity,
            }));

            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                shipping_address_collection: {
                    allowed_countries: ["US", "UA", "SK"],
                },
                phone_number_collection: {
                    enabled: true,
                },
                customer: customer.id,
                line_items,
                mode: "payment",
                success_url: `${process.env.CLIENT_URL}/checkout-success`,
                cancel_url: `${process.env.CLIENT_URL}/checkout-failed`,
            });

            await this.logger.logInfo(`Checkout session created: ${session.id}`);

            return session.url;
        } catch (error: any) {
            await this.logger.logError('Failed to create checkout session', error);
            throw error;
        }
    }
}
