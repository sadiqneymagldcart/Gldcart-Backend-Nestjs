import {Logger} from "../../utils/logger";
import Stripe from "stripe";
import {BaseService} from "../base.service";
import {inject, injectable} from "inversify";

@injectable()
export class StripeSubscriptionService extends BaseService {
    private stripe: Stripe;

    public constructor(@inject(Logger) logger: Logger, @inject(Stripe) stripe: Stripe) {
        super(logger);
        this.stripe = stripe;
    }

    public async createSubscriptionCheckout(
        userId: string,
        lookupKey: string,
    ): Promise<string | null> {
        try {
            await this.stripe.customers.create({
                metadata: {
                    userId: userId,
                },
            });

            const prices = await this.stripe.prices.list({
                lookup_keys: [lookupKey],
                expand: ["data.product"],
            });

            const session = await this.stripe.checkout.sessions.create({
                billing_address_collection: "auto",
                line_items: [
                    {
                        price: prices.data[0].id,
                        quantity: 1,
                    },
                ],
                mode: "subscription",
                success_url: `${process.env.CLIENT_URL}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.CLIENT_URL}?canceled=true`,
            });

            this.logger.logInfo(
                `Subscription checkout session created: ${session.id}`,
            );

            return session.url;
        } catch (error: any) {
            this.logger.logError(
                "Failed to create subscription checkout session",
                error,
            );
            throw error;
        }
    }

    public async cancelSubscription(subscriptionId: string): Promise<any> {
        try {
            const canceledSubscription =
                await this.stripe.subscriptions.cancel(subscriptionId);

            this.logger.logInfo(`Subscription cancelled: ${subscriptionId}`);

            return canceledSubscription;
        } catch (error: any) {
            this.logger.logError("Failed to cancel subscription", error);
            throw error;
        }
    }
}
