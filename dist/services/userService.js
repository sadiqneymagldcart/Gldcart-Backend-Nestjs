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
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const Token_1 = __importDefault(require("../models/Token"));
const tokenService_1 = __importDefault(require("./tokenService"));
const user_dto_1 = __importDefault(require("../dtos/user-dto"));
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const mailService_1 = __importDefault(require("./mailService"));
const mongoose_1 = require("mongoose");
const logger_1 = require("../util/logger");
class UserService {
    constructor() {
        this.logger = new logger_1.Logger();
    }
    registration(type, name, surname, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = yield User_1.default.findOne({ email });
            if (candidate) {
                throw api_error_1.default.BadRequest("That email is already registered");
            }
            const salt = yield bcrypt_1.default.genSalt();
            const hashedPassword = yield bcrypt_1.default.hash(password, salt);
            const user = yield User_1.default.create({
                type,
                name,
                surname,
                email,
                password: hashedPassword,
            });
            const userDto = new user_dto_1.default(user);
            const tokens = tokenService_1.default.createTokens(Object.assign({}, userDto));
            yield tokenService_1.default.saveToken(userDto.id, tokens.refreshToken);
            this.logger.logInfo(`User registered: ${email}`);
            return Object.assign(Object.assign({}, tokens), { user: userDto });
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ email });
            if (user) {
                const auth = yield bcrypt_1.default.compare(password, user.password);
                if (auth) {
                    const userDto = new user_dto_1.default(user);
                    const tokens = tokenService_1.default.createTokens(Object.assign({}, userDto));
                    yield tokenService_1.default.saveToken(userDto.id, tokens.refreshToken);
                    this.logger.logInfo(`User logged in: ${email}`);
                    return Object.assign(Object.assign({}, tokens), { user: userDto });
                }
                this.logger.logError(`Incorrect password for ${email}`);
                throw api_error_1.default.BadRequest("Incorrect password");
            }
            this.logger.logError(`User not found with email: ${email}`);
            throw api_error_1.default.BadRequest("Incorrect email");
        });
    }
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.logInfo(`User logged out`);
            return yield tokenService_1.default.removeToken(refreshToken);
        });
    }
    loginGoogleUser(code, customParameter, name, family_name, email, picture, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield this.findAndUpdateUser(customParameter, name, family_name, email, picture, password));
            {
                const userDto = new user_dto_1.default(user);
                const tokens = tokenService_1.default.createTokens(Object.assign({}, userDto));
                yield tokenService_1.default.saveToken(userDto.id, tokens.refreshToken);
                this.logger.logInfo(`User logged in with Google: ${userDto.email}`);
                return Object.assign(Object.assign({}, tokens), { user: userDto, picture: picture });
            }
        });
    }
    changePasswordWithToken(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ passwordResetToken: token });
            if (!user) {
                throw api_error_1.default.BadRequest("Invalid or expired token");
            }
            user.password = yield this.hashPassword(newPassword);
            user.passwordResetToken = undefined;
            yield user.save();
        });
    }
    changePasswordWithEmail(email, oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ email });
            if (user) {
                const auth = yield bcrypt_1.default.compare(oldPassword, user.password);
                if (auth) {
                    user.password = yield this.hashPassword(newPassword);
                    yield user.save();
                    return;
                }
                this.logger.logError(`Incorrect old password for email: ${email}`);
                throw api_error_1.default.BadRequest("Incorrect old password");
            }
            this.logger.logError(`User not found with email: ${email}`);
            throw api_error_1.default.BadRequest("Incorrect email");
        });
    }
    requestPasswordReset(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield User_1.default.findOneAndUpdate({ email }, { passwordResetToken: token }));
            if (!user) {
                this.logger.logError(`User not found with email: ${email}`);
                throw api_error_1.default.BadRequest("Incorrect email");
            }
            yield mailService_1.default.sendResetPasswordMail(email, `${process.env.CLIENT_URL}/reset-password/${token}`);
        });
    }
    refresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken) {
                this.logger.logError('There is no refresh token');
                throw api_error_1.default.UnauthorizedError();
            }
            const userData = tokenService_1.default.validateRefreshToken(refreshToken);
            const tokenFromDb = yield tokenService_1.default.findToken(refreshToken);
            if (!userData || !tokenFromDb) {
                this.logger.logError('Refresh token is invalid');
                throw api_error_1.default.UnauthorizedError();
            }
            const user = yield User_1.default.findById(userData.id);
            const userDto = new user_dto_1.default(user);
            const tokens = tokenService_1.default.createTokens(Object.assign({}, userDto));
            yield tokenService_1.default.saveToken(userDto.id, tokens.refreshToken);
            return Object.assign(Object.assign({}, tokens), { user: userDto });
        });
    }
    deleteData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield User_1.default.collection.drop();
                yield Token_1.default.collection.drop();
            }
            catch (err) {
                console.error("Error dropping collection:", err);
            }
        });
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salt = yield bcrypt_1.default.genSalt();
                return yield bcrypt_1.default.hash(password, salt);
            }
            catch (error) {
                throw error;
            }
        });
    }
    findAndUpdateUser(type, name, surname, email, picture, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield User_1.default.findOne({ email: email });
            if (existingUser)
                return existingUser;
            const firstName = name.split(' ')[0];
            const newUser = yield User_1.default.create({
                type: type,
                name: firstName,
                surname: surname,
                email: email,
                picture: picture,
                password: password,
            });
            this.logger.logInfo(`New user created with email: ${email}`);
            return newUser;
        });
    }
    addAddress(userId, addressData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findById(userId);
            if (!user) {
                this.logger.logError(`User ${userId} not found while adding address`);
                throw api_error_1.default.BadRequest("User not found");
            }
            const newAddressId = new mongoose_1.Types.ObjectId();
            const addressWithId = Object.assign(Object.assign({}, addressData), { id: newAddressId });
            user.addresses.push(addressWithId);
            yield user.save();
            this.logger.logInfo(`Address added for user ${userId}`, user.addresses);
            return user;
        });
    }
    updateAddress(userId, addressId, addressData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findById(userId);
            if (!user) {
                this.logger.logError(`User ${userId} was not found while updating address for email`);
                throw api_error_1.default.BadRequest('User was not found');
            }
            const addressIndex = user.addresses.findIndex(address => String(address.id) === String(addressId));
            if (addressIndex === -1) {
                this.logger.logError(`Address was not found for user ${userId}`);
                throw api_error_1.default.BadRequest('Address was not found');
            }
            Object.assign(user.addresses[addressIndex], addressData);
            yield user.save();
            this.logger.logInfo(`Address was updated for user ${userId}`);
        });
    }
    getAddresses(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findById(id);
            if (!user) {
                this.logger.logError(`User not found while fetching addresses for ID: ${id}`);
                throw api_error_1.default.BadRequest('User not found');
            }
            return user.addresses;
        });
    }
    deleteAddress(userId, addressId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findById(userId);
            if (!user) {
                this.logger.logError(`User ${userId} not found while deleting address for email`);
                throw api_error_1.default.BadRequest("User not found");
            }
            const addressIndex = user.addresses.findIndex(address => String(address.id) === String(addressId));
            if (addressIndex === -1) {
                this.logger.logError(`Address not found for user ${userId}`);
                throw api_error_1.default.BadRequest('Address not found');
            }
            user.addresses.splice(addressIndex, 1);
            yield user.save();
            this.logger.logInfo(`Address deleted for user ${userId}`);
            return user;
        });
    }
    updatePersonalDetails(id, email, name, surname, phone_number, address, BIO) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield User_1.default.findByIdAndUpdate(id, {
                name: name,
                surname: surname,
                email: email,
                phone_number: phone_number,
                address: address,
                BIO: BIO
            }));
            if (!user) {
                this.logger.logError(`User not found while updating details for ID: ${id}`);
                throw api_error_1.default.BadRequest("User not found");
            }
            yield user.save();
            this.logger.logInfo(`Personal details updated for user with ID: ${id}`);
        });
    }
}
exports.default = new UserService();
