import * as express from "express";
import { ApiException } from "@exceptions/api.exception";

function sendApiErrorResponse(error: ApiException, response: express.Response) {
    response.status(error.status).json({
        status: error.status,
        message: error.message,
        code: error.code,
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
    if (error instanceof ApiException) {
        sendApiErrorResponse(error, response);
    } else {
        sendServerErrorResponse(error, response);
    }
    next();
};
