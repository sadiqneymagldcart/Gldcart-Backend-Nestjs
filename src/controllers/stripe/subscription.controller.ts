import * as express from "express";
import {StripeSubscriptionService} from "../../services/stripe/stripe.subscription.service";
import {inject, injectable} from "inversify";
import {httpGet, httpPut} from "inversify-express-utils";
import {requireAuth} from "../../middlewares/auth.middleware";

@injectable()
export class SubscriptionController {
    private readonly subscriptionService: StripeSubscriptionService;

    constructor(
        @inject(StripeSubscriptionService)
            subscriptionService: StripeSubscriptionService,
    ) {
        this.subscriptionService = subscriptionService;
    }

    @httpGet("/checkout/:userId/:lookup_key", requireAuth)
    public async createSubscriptionCheckout(
        request: express.Request,
        response: express.Response,
        nextFunction: express.NextFunction,
    ): Promise<void> {
        const {userId, lookup_key} = request.body;
        try {
            const checkoutUrl =
                await this.subscriptionService.createSubscriptionCheckout(
                    userId,
                    lookup_key,
                );
            response.json({url: checkoutUrl});
        } catch (error) {
            nextFunction(error);
        }
    }

    @httpPut("/cancel", requireAuth)
    public async cancelSubscription(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ): Promise<any> {
        const subscriptionId = request.body.subscriptionId;
        try {
            const deletedSubscription =
                await this.subscriptionService.cancelSubscription(subscriptionId);
            response.send(deletedSubscription);
        } catch (error) {
            next(error);
        }
    }
}
