import { ApiError } from "@exceptions/api.error";
import * as express from "express";

function sendApiErrorResponse(error: ApiError, response: express.Response) {
    response.status(error.status).json({
        message: error.message,
        errors: error.errors,
    });
}

function sendServerErrorResponse(error: Error, response: express.Response) {
    response
        .status(501)
        .json({ message: `Internal Server Error: ${error.message}` });
}

export const errorHandlerMiddleware = (
    error: Error,
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
) => {
    if (error instanceof ApiError) {
        sendApiErrorResponse(error, response);
    } else {
        sendServerErrorResponse(error, response);
    }
    next();
};
