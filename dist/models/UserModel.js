"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const AddressModel_1 = require("./AddressModel");
const userSchema = new mongoose_1.Schema({
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
        required: [true, "Please, enter an email"],
        unique: true,
        lowercase: true,
        validate: [validator_1.default.isEmail, "Please, enter a valid email"],
    },
    addresses: [AddressModel_1.addressSchema],
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
const UserModel = mongoose_1.default.model("User", userSchema);
exports.default = UserModel;
