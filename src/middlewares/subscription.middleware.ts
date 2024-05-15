import { NextFunction, Response } from "express";
import { UserModel } from "@models/user/User";
import {UnauthorizedException} from "@exceptions/unauthorized.exception";

export const requireSubscription = (requiredSubscriptionType: string) => {
    return async (
        response: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const userId = response.locals.user.userId;

            if (!userId) {
                return next(new UnauthorizedException());
            }

            const user =
                await UserModel.findById(userId).populate("activeSubscription");

            if (!user || !user.activeSubscription) {
                response.status(403).json({ error: "No active subscription found" });
            }

            const userSubscriptionType = user?.activeSubscription;

            if (userSubscriptionType !== requiredSubscriptionType) {
                response
                    .status(403)
                    .json({ error: "Access denied for this subscription type" });
            }
            return next();
        } catch (error: any) {
            response.status(500).json({ error: "Internal server error" });
        }
    };
};
