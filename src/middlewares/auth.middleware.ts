import * as jwt from "jsonwebtoken";
import * as express from "express";
import { UnauthorizedException } from "@exceptions/unauthorized.exception";

export const requireAuth = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
): void => {
    const authorizationHeader = request.headers.authorization as string;

    if (!authorizationHeader) {
        console.log("No access token was provided");
        return next(new UnauthorizedException());
    }

    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
        console.log("Invalid access token");
        return next(new UnauthorizedException());
    }
    const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!);

    if (!userData) {
        return next(new UnauthorizedException());
    }
    response.locals.user = userData;
    next();
};
