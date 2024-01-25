import {NextFunction, Request, Response} from "express";
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
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const {userId, lookup_key} = req.body;
        try {
            const checkoutUrl =
                await this.subscriptionService.createSubscriptionCheckout(
                    userId,
                    lookup_key,
                );
            res.json({url: checkoutUrl});
        } catch (error) {
            next(error);
        }
    }

    @httpPut("/cancel", requireAuth)
    public async cancelSubscription(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<any> {
        const subscriptionId = req.body.subscriptionId;
        try {
            const deletedSubscription =
                await this.subscriptionService.cancelSubscription(subscriptionId);
            res.send(deletedSubscription);
        } catch (error) {
            next(error);
        }
    }
}
