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
const logger_1 = require("../util/logger");
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-08-16",
    typescript: true,
});
class SubscriptionService {
    constructor() {
        this.logger = new logger_1.Logger();
    }
    createSubscriptionCheckout(userId, lookupKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield stripe.customers.create({
                    metadata: {
                        userId: userId,
                    },
                });
                const prices = yield stripe.prices.list({
                    lookup_keys: [lookupKey],
                    expand: ['data.product'],
                });
                const session = yield stripe.checkout.sessions.create({
                    billing_address_collection: 'auto',
                    line_items: [
                        {
                            price: prices.data[0].id,
                            quantity: 1,
                        },
                    ],
                    mode: 'subscription',
                    success_url: `${process.env.CLIENT_URL}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${process.env.CLIENT_URL}?canceled=true`,
                });
                this.logger.logInfo(`Subscription checkout session created: ${session.id}`);
                return session.url;
            }
            catch (error) {
                this.logger.logError('Failed to create subscription checkout session', error);
                throw error;
            }
        });
    }
    cancelSubscription(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const deletedSubscription = yield stripe.subscriptions.del(subscriptionId);
                this.logger.logInfo(`Subscription cancelled: ${subscriptionId}`);
                return deletedSubscription;
            }
            catch (error) {
                this.logger.logError('Failed to cancel subscription', error);
                throw error;
            }
        });
    }
}
exports.default = new SubscriptionService();
