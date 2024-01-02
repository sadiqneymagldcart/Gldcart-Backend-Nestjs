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
const UserModel_1 = __importDefault(require("../models/UserModel"));
const TokenModel_1 = __importDefault(require("../models/TokenModel"));
const token_service_1 = __importDefault(require("./token-service"));
const user_dto_1 = __importDefault(require("../dtos/user-dto"));
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const mail_service_1 = __importDefault(require("./mail-service"));
const mongoose_1 = require("mongoose");
class UserService {
    registration(type, name, surname, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = yield UserModel_1.default.findOne({ email });
            if (candidate) {
                throw api_error_1.default.BadRequest("That email is already registered");
            }
            const salt = yield bcrypt_1.default.genSalt();
            const hashedPassword = yield bcrypt_1.default.hash(password, salt);
            const user = yield UserModel_1.default.create({
                type,
                name,
                surname,
                email,
                password: hashedPassword,
            });
            const userDto = new user_dto_1.default(user);
            const tokens = token_service_1.default.createTokens(Object.assign({}, userDto));
            yield token_service_1.default.saveToken(userDto.id, tokens.refreshToken);
            return Object.assign(Object.assign({}, tokens), { user: userDto });
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel_1.default.findOne({ email });
            if (user) {
                const auth = yield bcrypt_1.default.compare(password, user.password);
                if (auth) {
                    const userDto = new user_dto_1.default(user);
                    const tokens = token_service_1.default.createTokens(Object.assign({}, userDto));
                    yield token_service_1.default.saveToken(userDto.id, tokens.refreshToken);
                    return Object.assign(Object.assign({}, tokens), { user: userDto });
                }
                throw api_error_1.default.BadRequest("Incorrect password");
            }
            throw api_error_1.default.BadRequest("Incorrect email");
        });
    }
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield token_service_1.default.removeToken(refreshToken);
        });
    }
    loginGoogleUser(code, customParameter, name, family_name, email, picture, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield this.findAndUpdateUser(customParameter, name, family_name, email, picture, password));
            {
                const userDto = new user_dto_1.default(user);
                console.log(userDto);
                const tokens = token_service_1.default.createTokens(Object.assign({}, userDto));
                yield token_service_1.default.saveToken(userDto.id, tokens.refreshToken);
                return Object.assign(Object.assign({}, tokens), { user: userDto, picture: picture });
            }
        });
    }
    changePasswordWithToken(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel_1.default.findOne({ passwordResetToken: token });
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
            const user = yield UserModel_1.default.findOne({ email });
            if (user) {
                const auth = yield bcrypt_1.default.compare(oldPassword, user.password);
                if (auth) {
                    user.password = yield this.hashPassword(newPassword);
                    yield user.save();
                    return;
                }
                throw api_error_1.default.BadRequest("Incorrect old password");
            }
            throw api_error_1.default.BadRequest("Incorrect email");
        });
    }
    requestPasswordReset(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield UserModel_1.default.findOneAndUpdate({ email }, { passwordResetToken: token }));
            if (!user) {
                throw api_error_1.default.BadRequest("Incorrect email");
            }
            yield mail_service_1.default.sendResetPasswordMail(email, `${process.env.CLIENT_URL}/reset-password/${token}`);
        });
    }
    refresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken) {
                console.log("there is no refresh token");
                throw api_error_1.default.UnauthorizedError();
            }
            const userData = token_service_1.default.validateRefreshToken(refreshToken);
            const tokenFromDb = yield token_service_1.default.findToken(refreshToken);
            if (!userData || !tokenFromDb) {
                console.log(tokenFromDb);
                console.log("refresh token is invalid");
                throw api_error_1.default.UnauthorizedError();
            }
            const user = yield UserModel_1.default.findById(userData.id);
            const userDto = new user_dto_1.default(user);
            const tokens = token_service_1.default.createTokens(Object.assign({}, userDto));
            yield token_service_1.default.saveToken(userDto.id, tokens.refreshToken);
            return Object.assign(Object.assign({}, tokens), { user: userDto });
        });
    }
    deleteData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield UserModel_1.default.collection.drop();
                yield TokenModel_1.default.collection.drop();
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
            const existingUser = yield UserModel_1.default.findOne({ email: email });
            if (existingUser)
                return existingUser;
            return yield UserModel_1.default.create({
                type: type,
                name: name,
                surname: surname,
                email: email,
                picture: picture,
                password: password,
            });
        });
    }
    addAddress(email, addressData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel_1.default.findOne({ email });
            if (!user)
                throw api_error_1.default.BadRequest("User not found");
            const newAddressId = new mongoose_1.Types.ObjectId();
            const addressWithId = Object.assign(Object.assign({}, addressData), { id: newAddressId });
            user.addresses.push(addressWithId);
            yield user.save();
            return user;
        });
    }
    updateAddress(email, addressId, updatedAddressData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel_1.default.findOne({ email });
            if (!user) {
                throw api_error_1.default.BadRequest('User not found');
            }
            const addressIndex = user.addresses.findIndex(address => String(address.id) === String(addressId));
            if (addressIndex === -1) {
                throw api_error_1.default.BadRequest('Address not found');
            }
            Object.assign(user.addresses[addressIndex], updatedAddressData);
            yield user.save();
        });
    }
    getAddresses(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel_1.default.findById(id);
            if (!user) {
                throw api_error_1.default.BadRequest('User not found');
            }
            return user.addresses;
        });
    }
    updatePersonalDetails(id, email, name, surname, phone_number, address, BIO) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield UserModel_1.default.findByIdAndUpdate(id, {
                name: name,
                surname: surname,
                email: email,
                phone_number: phone_number,
                address: address,
                BIO: BIO
            }));
            if (!user) {
                throw api_error_1.default.BadRequest("User not found");
            }
            yield user.save();
        });
    }
}
exports.default = new UserService();
