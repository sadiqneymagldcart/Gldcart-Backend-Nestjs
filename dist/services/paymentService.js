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
class PaymentService {
    constructor() {
        this.logger = new logger_1.Logger();
    }
    createCustomer(email, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customer = yield stripe.customers.create({
                    email: `${email}`,
                    name: `${name}`,
                    shipping: {
                        address: {
                            city: 'Brothers',
                            country: 'US',
                            line1: '27 Fredrick Ave',
                            postal_code: '97712',
                            state: 'CA',
                        },
                        name: `${name}`,
                    },
                    address: {
                        city: 'Brothers',
                        country: 'US',
                        line1: '27 Fredrick Ave',
                        postal_code: '97712',
                        state: 'CA',
                    },
                });
                this.logger.logInfo(`Customer created: ${customer.id}`);
                return customer.id;
            }
            catch (error) {
                this.logger.logError('Failed to create customer', error);
                throw error;
            }
        });
    }
    createPaymentCheckout(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customer = yield stripe.customers.create({
                    metadata: {
                        userId: requestBody.userId,
                        cart: JSON.stringify(requestBody.cartItems),
                    },
                });
                const line_items = requestBody.cartItems.map((item) => ({
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: item.title,
                            images: [item.imageURL],
                            description: item.description,
                            // metadata: {
                            //     id: item.productId,
                            // },
                        },
                        unit_amount: item.price * 100,
                    },
                    quantity: item.quantity,
                }));
                const session = yield stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    shipping_address_collection: {
                        allowed_countries: ["US", "UA", "SK"],
                    },
                    phone_number_collection: {
                        enabled: true,
                    },
                    customer: customer.id,
                    line_items,
                    mode: "payment",
                    success_url: `${process.env.CLIENT_URL}/checkout-success`,
                    cancel_url: `${process.env.CLIENT_URL}/checkout-failed`,
                });
                this.logger.logInfo(`Checkout session created: ${session.id}`);
                return session.url;
            }
            catch (error) {
                this.logger.logError('Failed to create checkout session', error);
                throw error;
            }
        });
    }
}
exports.default = new PaymentService();
