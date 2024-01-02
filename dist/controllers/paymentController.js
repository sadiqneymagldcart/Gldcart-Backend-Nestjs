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
exports.createPaymentCheckout = exports.createCustomer = void 0;
const paymentService_1 = __importDefault(require("../services/paymentService"));
const createCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name } = req.body;
    try {
        const customerId = yield paymentService_1.default.createCustomer(email, name);
        res.send(customerId);
    }
    catch (error) {
        next(error);
    }
});
exports.createCustomer = createCustomer;
const createPaymentCheckout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const requestBody = req.body;
    try {
        const checkoutUrl = yield paymentService_1.default.createPaymentCheckout(requestBody);
        res.json({ url: checkoutUrl });
    }
    catch (error) {
        next(error);
    }
});
exports.createPaymentCheckout = createPaymentCheckout;
