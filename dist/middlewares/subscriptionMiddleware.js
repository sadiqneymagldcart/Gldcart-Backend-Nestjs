"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSubscription = void 0;
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const User_1 = __importDefault(require("../models/User"));
const requireSubscription = (requiredSubscriptionType) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = res.locals.user.userId;
            if (!userId) {
                return next(api_error_1.default.UnauthorizedError());
            }
            const user = yield User_1.default.findById(userId).populate('activeSubscription');
            if (!user || !user.activeSubscription) {
                res.status(403).json({ error: 'No active subscription found' });
            }
            const userSubscriptionType = user === null || user === void 0 ? void 0 : user.activeSubscription;
            if (userSubscriptionType !== requiredSubscriptionType) {
                res.status(403).json({ error: 'Access denied for this subscription type' });
            }
            return next();
        }
        catch (error) {
            console.error('Error checking subscription:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
};
exports.requireSubscription = requireSubscription;
