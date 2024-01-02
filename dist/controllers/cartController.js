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
exports.removeCartItemHandler = exports.addCartItemHandler = exports.getCartItems = void 0;
const logger_1 = require("../util/logger");
const cartService_1 = __importDefault(require("../services/cartService"));
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const logger = new logger_1.Logger();
const getCartItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartId } = req.params;
    try {
        const cartItems = yield cartService_1.default.getCartItems(cartId);
        res.status(200).json({ cartItems: cartItems });
    }
    catch (error) {
        logger.logError(`getCartItems error: ${error.message}`);
        next(new api_error_1.default(500, `Server error: ${error.message}`));
    }
});
exports.getCartItems = getCartItems;
const addCartItemHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, productId, quantity } = req.body;
    if (typeof userId !== 'string' || typeof productId !== 'string' || typeof quantity !== 'number') {
        logger.logError('Invalid request parameters. The userId and productId should be strings and quantity should be a number');
        return next(new Error('Invalid request parameters. The userId and productId should be strings and quantity should be a number'));
    }
    try {
        const cart = yield cartService_1.default.addCartItem(userId, productId, quantity);
        res.status(200).json({ message: 'Item added to cart', cart });
        logger.logInfo(`Adding product ${productId} to cart for user ${userId}`);
    }
    catch (error) {
        logger.logError(`addCartItemHandler error: ${error.message}`);
        next(new api_error_1.default(500, `Server error: ${error.message}`));
    }
});
exports.addCartItemHandler = addCartItemHandler;
const removeCartItemHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cartId, itemId } = req.params;
        const cart = yield cartService_1.default.removeItem(cartId, itemId);
        return res.status(200).json({ message: 'Item deleted from cart', cart });
    }
    catch (error) {
        logger.logError(`removeCartItemHandler error: ${error.message}`);
        next(new api_error_1.default(500, `Server error: ${error.message}`));
    }
});
exports.removeCartItemHandler = removeCartItemHandler;
