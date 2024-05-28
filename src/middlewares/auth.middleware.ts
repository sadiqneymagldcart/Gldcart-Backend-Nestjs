import * as jwt from "jsonwebtoken";
import * as express from "express";
import { UnauthorizedException } from "@exceptions/unauthorized.exception";

export const authMiddleware = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
): void => {
    const authorizationHeader = request.headers.authorization as string;

    if (!authorizationHeader) {
        console.error("No access token was provided");
        return next(new UnauthorizedException());
    }

    const parts = authorizationHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        console.error("Invalid authorization header format");
        return next(new UnauthorizedException());
    }

    const accessToken = parts[1];

    if (!process.env.JWT_ACCESS_SECRET) {
        console.error("JWT secret is not defined");
        throw new Error("JWT secret is not defined");
    }

    try {
        const userData = jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_SECRET,
        ) as jwt.JwtPayload;

        if (!userData) {
            return next(new UnauthorizedException());
        }

        response.locals.user = userData;
        next();
    } catch (error) {
        console.error("Failed to verify access token", error);
        return next(new UnauthorizedException());
    }
};
