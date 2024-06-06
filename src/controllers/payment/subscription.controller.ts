import * as express from "express";
import { StripeSubscriptionService } from "@services/payment/stripe-subscription.service";
import { inject } from "inversify";
import {
    BaseHttpController,
    controller,
    httpGet,
    httpPut,
} from "inversify-express-utils";
import { AuthenticationMiddleware } from "@middlewares/authentication.middleware";

@controller("/subscription", AuthenticationMiddleware)
export class SubscriptionController extends BaseHttpController {
    private readonly subscriptionService: StripeSubscriptionService;

    public constructor(
        @inject(StripeSubscriptionService)
        subscriptionService: StripeSubscriptionService,
    ) {
        super();
        this.subscriptionService = subscriptionService;
    }

    @httpGet("/checkout/:userId/:lookup_key")
    public async createSubscriptionCheckout(
        request: express.Request,
    ): Promise<void> {
        const { userId, lookup_key } = request.body;
        const checkoutUrl =
            await this.subscriptionService.createSubscriptionCheckout(
                userId,
                lookup_key,
            );
        this.json({ url: checkoutUrl });
    }

    @httpPut("/cancel")
    public async cancelSubscription(request: express.Request): Promise<void> {
        const subscriptionId = request.body.subscriptionId;
        const deletedSubscription =
            await this.subscriptionService.cancelSubscription(subscriptionId);
        this.json(deletedSubscription);
    }
}
