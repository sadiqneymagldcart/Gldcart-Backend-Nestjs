"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var wishlistSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Product' }]
});
var WishList = mongoose_1.default.model('Wishlist', wishlistSchema);
exports.default = WishList;
