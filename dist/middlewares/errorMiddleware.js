"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
var api_error_1 = require("../exceptions/api-error");
var utils_1 = require("../utils");
function errorHandler(error, request, response) {
    utils_1.logger.logError(error.message, error);
    if (error instanceof api_error_1.ApiError) {
        var apiError = error;
        response.status(apiError.status).json({
            message: apiError.message,
            errors: apiError.errors,
        });
    }
    response.status(500).json({ message: 'Undefined server error' });
}
exports.errorHandler = errorHandler;
