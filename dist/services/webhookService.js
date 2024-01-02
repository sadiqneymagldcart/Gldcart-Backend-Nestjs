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
exports.handleStripeWebhook = void 0;
const stripe_1 = __importDefault(require("stripe"));
const logger_1 = require("../util/logger");
const orderService_1 = __importDefault(require("./orderService"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-08-16",
    typescript: true,
});
const logger = new logger_1.Logger();
const handleStripeWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let event;
        const signature = req.headers['stripe-signature'];
        try {
            event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
        }
        catch (error) {
            logger.logError('Webhook signature verification failed', error);
            res.sendStatus(400);
            return;
        }
        const data = event.data.object;
        const eventType = event.type;
        switch (eventType) {
            case 'checkout.session.completed':
                try {
                    const customer = yield stripe.customers.retrieve(data.customer);
                    yield orderService_1.default.createOrder(customer, data);
                }
                catch (error) {
                    logger.logError('Error handling checkout session completion', error);
                }
                break;
            default:
                logger.logInfo(`Unhandled event type ${event.type}`);
        }
        res.send();
    }
    catch (error) {
        logger.logError('Error handling webhook event', error);
        res.status(500).send('Internal Server Error');
    }
});
exports.handleStripeWebhook = handleStripeWebhook;
