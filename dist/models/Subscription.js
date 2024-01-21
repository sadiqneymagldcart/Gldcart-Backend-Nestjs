"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var subscriptionSchema = new mongoose_1.Schema({
    type: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
});
var Subscription = mongoose_1.default.model('Subscription', subscriptionSchema);
exports.default = Subscription;
