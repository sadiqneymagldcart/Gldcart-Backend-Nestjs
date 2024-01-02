"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressSchema = void 0;
const mongoose_1 = require("mongoose");
exports.addressSchema = new mongoose_1.Schema({
    recipients_name: {
        type: String,
        required: true
    },
    street_address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String
    },
    country: {
        type: String,
        required: true
    },
    ZIP_code: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    }
});
