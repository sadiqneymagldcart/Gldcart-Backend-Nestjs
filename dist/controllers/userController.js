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
exports.updatePersonalDetails = exports.googleOauthHandler = exports.sendContactEmail = exports.refresh = exports.resetPasswordWithEmail = exports.resetPasswordWithToken = exports.initiatePasswordReset = exports.logout = exports.login = exports.signup = void 0;
const mailService_1 = __importDefault(require("../services/mailService"));
const userService_1 = __importDefault(require("../services/userService"));
const tokenService_1 = __importDefault(require("../services/tokenService"));
const uuid_1 = require("uuid");
const googleService_1 = require("../services/googleService");
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, name, surname, email, password } = req.body;
    try {
        const userData = yield userService_1.default.registration(type, name, surname, email, password);
        res.cookie("refreshToken", userData.refreshToken, {
            httpOnly: true,
            maxAge: process.env.COOKIES_MAX_AGE,
        });
        res.status(201).json(userData);
    }
    catch (error) {
        next(error);
    }
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const userData = yield userService_1.default.login(email, password);
        res.cookie("refreshToken", userData.refreshToken, {
            httpOnly: true,
            maxAge: process.env.COOKIES_MAX_AGE,
        });
        res.status(201).json(userData);
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshToken;
        const token = yield userService_1.default.logout(refreshToken);
        res.clearCookie("refreshToken");
        return res.json(token);
    }
    catch (e) {
        next(e);
    }
});
exports.logout = logout;
const initiatePasswordReset = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const token = (0, uuid_1.v4)();
        yield userService_1.default.requestPasswordReset(email, token);
        res
            .status(200)
            .json({ message: "Password reset link was sent to your email." });
    }
    catch (error) {
        next(error);
    }
});
exports.initiatePasswordReset = initiatePasswordReset;
const resetPasswordWithToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token: token } = req.params;
    const { newPassword } = req.body;
    try {
        yield userService_1.default.changePasswordWithToken(token, newPassword);
        res.status(200).json({ message: "Password was reset successfully." });
    }
    catch (error) {
        next(error);
    }
});
exports.resetPasswordWithToken = resetPasswordWithToken;
const resetPasswordWithEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, oldPassword, newPassword } = req.body;
    try {
        yield userService_1.default.changePasswordWithEmail(email, oldPassword, newPassword);
        res.status(200).json({ message: "Password was reset successfully." });
    }
    catch (error) {
        next(error);
    }
});
exports.resetPasswordWithEmail = resetPasswordWithEmail;
const refresh = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshToken;
        const userData = yield userService_1.default.refresh(refreshToken);
        res.cookie("refreshToken", userData.refreshToken, {
            httpOnly: true,
            maxAge: process.env.COOKIES_MAX_AGE,
        });
        return res.json(userData);
    }
    catch (error) {
        next(error);
    }
});
exports.refresh = refresh;
const sendContactEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, subject, message, token } = req.body;
    try {
        const userData = token ? tokenService_1.default.validateAccessToken(token) : null;
        const recipientEmail = email || (userData === null || userData === void 0 ? void 0 : userData.email);
        if (recipientEmail) {
            yield mailService_1.default.sendContactMail(name, recipientEmail, subject, message);
            return res.json({ success: true, message: "Email sent successfully" });
        }
        return res
            .status(400)
            .json({ success: false, message: "Error. Email was not sent" });
    }
    catch (error) {
        next(error);
    }
});
exports.sendContactEmail = sendContactEmail;
const googleOauthHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code;
    const customParameter = req.query.state;
    try {
        const googleData = new googleService_1.GoogleOAuthService();
        const { id_token, access_token } = yield googleData.getGoogleOAuthTokens({ code });
        const googleUser = yield googleData.getGoogleUser(id_token, access_token);
        if (!googleUser.verified_email) {
            return res.status(403).send("Google account is not verified");
        }
        const userData = yield userService_1.default.loginGoogleUser(code, customParameter, googleUser.name, googleUser.family_name, googleUser.email, googleUser.picture, process.env.USERS_AFTER_GOOGLE_PASSWORD);
        res.cookie("refreshToken", userData.refreshToken, {
            httpOnly: true,
            maxAge: process.env.COOKIES_MAX_AGE,
        });
        const redirectURL = `${process.env.CLIENT_URL}`;
        res.redirect(redirectURL);
    }
    catch (error) {
        return res.redirect(`${process.env.CLIENT_URL}/oauth/error`);
    }
});
exports.googleOauthHandler = googleOauthHandler;
const updatePersonalDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, surname, email, phone_number, address, BIO } = req.body;
    try {
        yield userService_1.default.updatePersonalDetails(id, email, name, surname, phone_number, address, BIO);
        res.status(200).json({ message: 'User details updated successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.updatePersonalDetails = updatePersonalDetails;
