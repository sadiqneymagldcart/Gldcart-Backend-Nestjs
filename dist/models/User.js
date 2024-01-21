"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var validator_1 = require("validator");
var Address_1 = require("./Address");
var userSchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: [true, "Client's type is undefined"],
    },
    name: {
        type: String,
        required: [true, "Please, enter your first name"],
    },
    surname: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Please, enter an mail"],
        unique: true,
        lowercase: true,
        validate: [validator_1.default.isEmail, "Please, enter a valid mail"],
    },
    addresses: [Address_1.addressSchema],
    picture: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "Please, enter a password"],
        minlength: [6, "Minimum password length is 6 characters"],
    },
    passwordResetToken: {
        type: String,
    },
    activeSubscription: {
        type: String,
        ref: 'Subscription',
        default: null,
    },
    BIO: {
        type: String,
    },
    phone_number: {
        type: String,
    },
    address: {
        type: String,
    },
});
var User = mongoose_1.default.model("User", userSchema);
exports.default = User;
