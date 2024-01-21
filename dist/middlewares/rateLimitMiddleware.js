"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitMiddlewareTyped = void 0;
var express_rate_limit_1 = require("express-rate-limit");
var rateLimitOptions = {
    windowMs: 15 * 60 * 1000,
    max: 1,
    message: 'You have exceeded your 5 requests per minute limit.',
    headers: true,
};
var rateLimitMiddleware = (0, express_rate_limit_1.default)(rateLimitOptions);
exports.rateLimitMiddlewareTyped = rateLimitMiddleware;
