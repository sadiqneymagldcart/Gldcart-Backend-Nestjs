import {Logger} from "../../utils/logger";
import Stripe from "stripe";
import {BaseService} from "../baseService";

export class StripeSubscriptionService extends BaseService{
    private stripe: Stripe;

    constructor(logger: Logger, stripe: Stripe) {
        super(logger);
        this.stripe = stripe;
    }

    async createSubscriptionCheckout(userId: string, lookupKey: string): Promise<string | null> {
        try {
            await this.stripe.customers.create({
                metadata: {
                    userId: userId,
                },
            });

            const prices = await this.stripe.prices.list({
                lookup_keys: [lookupKey],
                expand: ['data.product'],
            });

            const session = await this.stripe.checkout.sessions.create({
                billing_address_collection: 'auto',
                line_items: [
                    {
                        price: prices.data[0].id,
                        quantity: 1,
                    },
                ],
                mode: 'subscription',
                success_url: `${process.env.CLIENT_URL}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.CLIENT_URL}?canceled=true`,
            });

            await this.logger.logInfo(`Subscription checkout session created: ${session.id}`);

            return session.url;
        } catch (error: any) {
            await this.logger.logError('Failed to create subscription checkout session', error);
            throw error;
        }
    }

    async cancelSubscription(subscriptionId: string): Promise<any> {
        try {

            const canceledSubscription = await this.stripe.subscriptions.cancel(subscriptionId);

            await this.logger.logInfo(`Subscription cancelled: ${subscriptionId}`);

            return canceledSubscription;
        } catch (error: any) {
            await this.logger.logError('Failed to cancel subscription', error);
            throw error;
        }
    }
}
