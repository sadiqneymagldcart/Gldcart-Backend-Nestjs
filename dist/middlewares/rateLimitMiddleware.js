"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitMiddlewareTyped = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rateLimitOptions = {
    windowMs: 15 * 60 * 1000,
    max: 1,
    message: 'You have exceeded your 5 requests per minute limit.',
    headers: true,
};
const rateLimitMiddleware = (0, express_rate_limit_1.default)(rateLimitOptions);
exports.rateLimitMiddlewareTyped = rateLimitMiddleware;
