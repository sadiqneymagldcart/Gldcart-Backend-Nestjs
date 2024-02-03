import {NextFunction, Request, Response} from "express";
import {ApiError} from "../exceptions/api.error";

function sendApiErrorResponse(error: ApiError, response: Response) {
    response.status(error.status).json({
        message: error.message,
        errors: error.errors,
    });
}

function sendServerErrorResponse(error: Error, response: Response) {
    response
        .status(501)
        .json({message: `Internal Server Error: ${error.message}`});
}

export function errorHandlerMiddleware(
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction,
) {
    if (error instanceof ApiError) {
        sendApiErrorResponse(error, response);
        console.log("ApiError");
    } else {
        sendServerErrorResponse(error, response);
        console.log("Error");
    }
    next();
}
