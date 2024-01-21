"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchema = void 0;
var mongoose_1 = require("mongoose");
exports.productSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    imageURL: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
});
var Product = mongoose_1.default.model('Product', exports.productSchema);
exports.default = Product;
