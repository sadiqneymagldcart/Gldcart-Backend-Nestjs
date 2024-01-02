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
const Cart_1 = require("../models/Cart");
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const Product_1 = __importDefault(require("../models/Product"));
const mongoose_1 = require("mongoose");
class CartService {
    constructor() {
        this.logger = new logger_1.Logger();
    }
    getCartItems(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userId) {
                    return api_error_1.default.BadRequest('Invalid inputs');
                }
                const cartItems = yield Cart_1.Cart.findOne({ user: userId });
                if (!cartItems) {
                    this.logger.logInfo(`Cart not found for User: ${userId}`);
                    return api_error_1.default.BadRequest("Cart not found");
                }
                this.logger.logInfo(`Retrieved cart items successfully for User: ${userId}`);
                return cartItems;
            }
            catch (error) {
                this.logger.logError(`Error while retrieving cart items for User: ${userId}. Error: ${error.message}`);
                return api_error_1.default.BadRequest(error.message);
            }
        });
    }
    addCartItem(userId, productId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield Product_1.default.findById(productId);
                if (!product || product.quantity < quantity) {
                    this.logger.logError(`Product not found or insufficient quantity for productId: ${productId}`);
                    return api_error_1.default.BadRequest('Product not found or insufficient quantity');
                }
                let cart = yield Cart_1.Cart.findOneAndUpdate({ user: userId, 'items.product': { $ne: productId } }, { $push: { items: { product: new mongoose_1.Types.ObjectId(productId), quantity: quantity } } }, { new: true });
                if (!cart) {
                    let newCart = {
                        user: userId,
                        items: [{ product: new mongoose_1.Types.ObjectId(productId), quantity: quantity }]
                    };
                    cart = yield Cart_1.Cart.create(newCart);
                    this.logger.logInfo(`New cart created for User: ${userId}`);
                }
                else {
                    this.logger.logInfo(`Product added to the cart. ProductId: ${productId}, Quantity: ${quantity}`);
                }
                return cart;
            }
            catch (error) {
                this.logger.logError(`Error while adding cart item for User: ${userId}. Error: ${error.message}`);
                return api_error_1.default.BadRequest(error.message);
            }
        });
    }
    removeItem(userId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userId || !productId) {
                    return api_error_1.default.BadRequest('Invalid inputs');
                }
                const cart = yield Cart_1.Cart.findOneAndUpdate({ user: userId }, { $pull: { items: { product: productId } } }, { new: true });
                if (!cart) {
                    this.logger.logInfo(`Cart not found for User: ${userId}`);
                    return api_error_1.default.BadRequest("Cart not found");
                }
                this.logger.logInfo(`Product removed successfully from User: ${userId}'s cart`);
                return cart;
            }
            catch (error) {
                this.logger.logError(`Error while removing product from User: ${userId}'s cart. Error: ${error.message}`);
                return api_error_1.default.BadRequest(error.message);
            }
        });
    }
}
exports.default = new CartService();
