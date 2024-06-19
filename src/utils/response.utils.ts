import * as express from "express";

export function handleResponse(response: express.Response, data: any) {
    return response.status(200).json({
        success: true,
        data,
    });
}

export function handleError(
    response: express.Response,
    error: any,
    _next: express.NextFunction,
) {
    return response.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
    });
}
