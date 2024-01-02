"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const tokenService_1 = __importDefault(require("../services/tokenService"));
const requireAuth = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        console.log("no access token was provided");
        return next(api_error_1.default.UnauthorizedError());
    }
    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
        console.log("invalid access token");
        return next(api_error_1.default.UnauthorizedError());
    }
    const userData = tokenService_1.default.validateAccessToken(accessToken);
    if (!userData) {
        return next(api_error_1.default.UnauthorizedError());
    }
    res.locals.user = userData;
    next();
};
exports.requireAuth = requireAuth;
