import * as jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import {UnauthorizedException} from "@exceptions/unauthorized.exception";

export const requireAuth = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const authorizationHeader = req.headers.authorization as string;

    if (!authorizationHeader) {
        console.log("No access token was provided");
        return next(new UnauthorizedException());
    }

    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
        console.log("Invalid access token");
        return next(new UnauthorizedException());
    }
    const userData = jwt.verify(accessToken, process.env.JWT_REFRESH_SECRET!);

    if (!userData) {
        return next(new UnauthorizedException());
    }
    res.locals.user = userData;
    next();
};
