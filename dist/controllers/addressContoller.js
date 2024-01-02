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
exports.getAddressesHandler = exports.deleteAddressHandler = exports.updateAddressHandler = exports.addAddressHandler = void 0;
const userService_1 = __importDefault(require("../services/userService"));
const mongoose_1 = require("mongoose");
const addAddressHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, addressData } = req.body;
    if (!mongoose_1.Types.ObjectId.isValid(userId)) {
        return next(new Error("Invalid userId"));
    }
    try {
        yield userService_1.default.addAddress(userId, addressData);
        res.status(200).json({ message: "Address was added successfully." });
    }
    catch (error) {
        next(error);
    }
});
exports.addAddressHandler = addAddressHandler;
const updateAddressHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, addressData, addressId } = req.body;
    if (!mongoose_1.Types.ObjectId.isValid(userId) || !mongoose_1.Types.ObjectId.isValid(addressId)) {
        return next(new Error("Invalid userId or addressId"));
    }
    try {
        yield userService_1.default.updateAddress(userId, addressId, addressData);
        res.status(200).json({ message: "Address was updated successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.updateAddressHandler = updateAddressHandler;
const deleteAddressHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, addressId } = req.body;
    if (!mongoose_1.Types.ObjectId.isValid(userId) || !mongoose_1.Types.ObjectId.isValid(addressId)) {
        return next(new Error("Invalid userId or addressId"));
    }
    try {
        yield userService_1.default.deleteAddress(userId, addressId);
        res.status(200).json({ message: "Address was deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteAddressHandler = deleteAddressHandler;
const getAddressesHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        return next(new Error("Invalid userId"));
    }
    try {
        const addresses = yield userService_1.default.getAddresses(id);
        res.status(200).json(addresses);
    }
    catch (error) {
        next(error);
    }
});
exports.getAddressesHandler = getAddressesHandler;
// function isAddressValid(address: IAddress) {
//     const {
//         recipients_name,
//         street_address,
//         city,
//         country,
//         ZIP_code,
//         phone_number,
//     } = address;
//
//     const hasRequiredFields = recipients_name && street_address && city && country && ZIP_code && phone_number;
//
//     const isZipValid = /(^\d{5}$)/.test(ZIP_code);
//     const isPhoneValid = /(^\d{10}$)/.test(phone_number);
//
//     return hasRequiredFields && isZipValid && isPhoneValid;
// }
