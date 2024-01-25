import {NextFunction, Request, Response} from "express";
import {ApiError} from "../exceptions/api.error";
import {Logger} from "../utils/logger";
import {container} from "../config/inversify.config";

export function errorHandler(
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction
) {
    container.get(Logger).logError(error.message, error);
    if (error instanceof ApiError) {
        const apiError = error as ApiError;

        response.status(apiError.status).json({
            message: apiError.message,
            errors: apiError.errors,
        });
    } else {
        response.status(500).json({message: "Undefined server error"});
    }
}
