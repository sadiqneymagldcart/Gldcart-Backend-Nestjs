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
const OrderModel_1 = __importDefault(require("../models/OrderModel"));
class OrderService {
    createOrder(customer, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if ("metadata" in customer &&
                "customer" in data &&
                "payment_intent" in data &&
                "amount_subtotal" in data &&
                "amount_total" in data &&
                "customer_details" in data &&
                "payment_status" in data) {
                const Items = JSON.parse(customer.metadata.cart);
                console.log(Items);
                try {
                    const newOrder = new OrderModel_1.default({
                        userId: customer.metadata.userId,
                        customerId: data.customer,
                        paymentIntentId: data.payment_intent,
                        products: Items,
                        subtotal: data.amount_subtotal,
                        total: data.amount_total,
                        shipping: data.customer_details,
                        payment_status: data.payment_status,
                    });
                    const savedOrder = yield newOrder.save();
                    console.log("Processed OrderModel:", savedOrder);
                }
                catch (err) {
                    console.log(err);
                }
            }
        });
    }
}
exports.default = new OrderService();
