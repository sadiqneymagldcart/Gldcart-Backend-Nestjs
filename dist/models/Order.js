"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var Product_1 = require("./Product");
var orderSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    products: [Product_1.productSchema],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    shipping: { type: Object },
    delivery_status: { type: String, default: 'pending' },
    payment_status: { type: String, required: true },
});
var Order = mongoose_1.default.model('Order', orderSchema);
exports.default = Order;
