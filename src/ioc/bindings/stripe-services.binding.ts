import { STRIPE_SECRET_KEY, stripeConfig } from "@config/stripe.config";
import { StripeSubscriptionService } from "@services/payment/stripe-subscription.service";
import { StripeWebhookService } from "@services/payment/stripe-webhook.service";
import { StripeService } from "@services/payment/stripe.service";
import { Container } from "inversify";
import Stripe from "stripe";

function bindStripeServices(container: Container) {
    container
        .bind(Stripe)
        .toDynamicValue(
            () => new Stripe(STRIPE_SECRET_KEY as string, stripeConfig),
        );
    container.bind(StripeService).toSelf();
    container.bind(StripeSubscriptionService).toSelf();
    container.bind(StripeWebhookService).toSelf();
}

export { bindStripeServices };

