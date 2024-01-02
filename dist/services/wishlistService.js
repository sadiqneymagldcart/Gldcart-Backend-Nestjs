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
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const WishList_1 = __importDefault(require("../models/WishList"));
const mongoose_1 = __importDefault(require("mongoose"));
class WishlistService {
    constructor(logger) {
        this.logger = logger;
    }
    addToWishlist(userId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let wishlist = yield WishList_1.default.findOne({ user: userId });
                if (!wishlist) {
                    wishlist = new WishList_1.default({ user: userId, products: [productId] });
                }
                else if (!wishlist.products.includes(new mongoose_1.default.Types.ObjectId(productId))) {
                    wishlist.products.push(new mongoose_1.default.Types.ObjectId(productId));
                    wishlist = yield wishlist.save();
                }
                return this.saveWishlist(wishlist, 'Error adding to wishlist.');
            }
            catch (err) {
                this.logger.logError('Error in addToWishlist method', { error: err });
                throw api_error_1.default.InternalServerError('Error adding product to wishlist');
            }
        });
    }
    removeFromWishlist(userId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const wishlist = yield WishList_1.default.findOne({ user: userId });
            if (!wishlist) {
                this.logger.logError('Wishlist not found.', { userId });
                throw api_error_1.default.BadRequest("Wishlist not found.");
            }
            const productIndex = wishlist.products.indexOf(productId);
            if (productIndex > -1) {
                wishlist.products.splice(productIndex, 1);
            }
            else {
                this.logger.logError('Product not found in wishlist.', { userId, productId });
                throw api_error_1.default.BadRequest("Product not found in wishlist.");
            }
            return this.saveWishlist(wishlist, 'Error removing from wishlist.');
        });
    }
    getWishlist(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield WishList_1.default.findOne({ user: userId }).populate('products');
            }
            catch (err) {
                this.logger.logError('Error retrieving wishlist.', { error: err });
                throw api_error_1.default.BadRequest("Error retrieving wishlist.");
            }
        });
    }
    saveWishlist(wishlist, errorMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield wishlist.save();
            }
            catch (err) {
                this.logger.logError(errorMessage, { error: err });
                throw api_error_1.default.InternalServerError(errorMessage);
            }
        });
    }
}
exports.default = new WishlistService();
