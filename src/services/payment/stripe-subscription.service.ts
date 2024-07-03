import { Logger } from "@utils/logger";
import Stripe from "stripe";
import { inject, injectable } from "inversify";
import { BaseService } from "../base/base.service";

@injectable()
export class StripeSubscriptionService extends BaseService {
    private readonly _stripe: Stripe;

    public constructor(
        @inject(Logger) logger: Logger,
        @inject(Stripe) stripe: Stripe,
    ) {
        super(logger);
        this._stripe = stripe;
    }

    public async createSubscriptionCheckout(
        userId: string,
        lookupKey: string,
    ): Promise<string | null> {
        try {
            await this._stripe.customers.create({
                metadata: {
                    userId: userId,
                },
            });

            const prices = await this._stripe.prices.list({
                lookup_keys: [lookupKey],
                expand: ["data.product"],
            });

            const session = await this._stripe.checkout.sessions.create({
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
                await this._stripe.subscriptions.cancel(subscriptionId);

            this.logger.logInfo(`Subscription cancelled: ${subscriptionId}`);

            return canceledSubscription;
        } catch (error: any) {
            this.logger.logError("Failed to cancel subscription", error);
            throw error;
        }
    }
}
