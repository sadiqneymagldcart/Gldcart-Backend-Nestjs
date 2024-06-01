import * as express from "express";
import { UnauthorizedException } from "@exceptions/unauthorized.exception";
import { BaseMiddleware } from "inversify-express-utils";
import { inject, injectable } from "inversify";
import { UserService } from "@services/user/user.service";

@injectable()
class SubscriptionMiddlware extends BaseMiddleware {
    private readonly userService: UserService;
    private requiredSubscriptionType: string;

    public constructor(
        @inject(UserService) userService: UserService,
        requiredSubscriptionType: string,
    ) {
        super();
        this.userService = userService;
        this.requiredSubscriptionType = requiredSubscriptionType;
    }
    public async handler(
        _request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        const userId = response.locals.user.userId;

        if (!userId) {
            return next(new UnauthorizedException());
        }

        const user = await this.userService.getUserByIdAndPopulate(
            userId,
            "activeSubscription",
        );

        if (!user || !user.activeSubscription) {
            response.status(403).json({ error: "No active subscription found" });
        }

        const userSubscriptionType = user?.activeSubscription;

        if (userSubscriptionType !== this.requiredSubscriptionType) {
            response
                .status(403)
                .json({ error: "Access denied for this subscription type" });
        }
        next();
    }
}
export { SubscriptionMiddlware };
