"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
var api_error_1 = require("../exceptions/api-error");
var server_1 = require("../server");
var tokenService_1 = require("../services/token/tokenService");
var requireAuth = function (req, res, next) {
    var authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        console.log("no access token was provided");
        return next(api_error_1.ApiError.UnauthorizedError());
    }
    var accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
        console.log("invalid access token");
        return next(api_error_1.ApiError.UnauthorizedError());
    }
    var userData = server_1.container.get(tokenService_1.TokenService).validateAccessToken(accessToken);
    if (!userData) {
        return next(api_error_1.ApiError.UnauthorizedError());
    }
    res.locals.user = userData;
    next();
};
exports.requireAuth = requireAuth;
