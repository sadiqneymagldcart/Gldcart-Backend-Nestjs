import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";

const rateLimitOptions = {
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: "You have exceeded your allowed amount of requests",
    headers: true,
};

const rateLimitMiddleware = rateLimit(rateLimitOptions);

type MiddlewareFunction = (
    req: Request,
    res: Response,
    next: NextFunction,
) => void;

export const rateLimitMiddlewareTyped: MiddlewareFunction = rateLimitMiddleware;
