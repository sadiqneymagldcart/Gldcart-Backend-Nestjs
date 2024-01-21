import {Response, Request} from 'express';
import {ApiError} from '../exceptions/api-error';
import { logger } from '../utils';

export function errorHandler(error: Error, request: Request, response: Response
) {
    logger.logError(error.message, error);
    if (error instanceof ApiError) {
        const apiError = error as ApiError;

        response.status(apiError.status).json({
            message: apiError.message,
            errors: apiError.errors,
        });
    }
    response.status(500).json({message: 'Undefined server error'});
}
