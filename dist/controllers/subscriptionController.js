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
exports.cancelSubscription = exports.createSubscriptionCheckout = void 0;
const subscriptionService_1 = __importDefault(require("../services/subscriptionService"));
const createSubscriptionCheckout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, lookup_key } = req.body;
    try {
        const checkoutUrl = yield subscriptionService_1.default.createSubscriptionCheckout(userId, lookup_key);
        res.json({ url: checkoutUrl });
    }
    catch (error) {
        next(error);
    }
});
exports.createSubscriptionCheckout = createSubscriptionCheckout;
const cancelSubscription = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const subscriptionId = req.body.subscriptionId;
    try {
        const deletedSubscription = yield subscriptionService_1.default.cancelSubscription(subscriptionId);
        res.send(deletedSubscription);
    }
    catch (error) {
        next(error);
    }
});
exports.cancelSubscription = cancelSubscription;
