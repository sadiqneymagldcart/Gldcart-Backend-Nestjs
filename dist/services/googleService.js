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
exports.GoogleOAuthService = void 0;
const qs_1 = __importDefault(require("qs"));
const axios_1 = __importDefault(require("axios"));
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const logger_1 = require("../util/logger");
class GoogleOAuthService {
    constructor() {
        this.logger = new logger_1.Logger();
    }
    getGoogleOAuthTokens({ code }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const url = "https://oauth2.googleapis.com/token";
            const values = {
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                grant_type: "authorization_code",
            };
            try {
                const res = yield axios_1.default.post(url, qs_1.default.stringify(values), {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                });
                return res.data;
            }
            catch (error) {
                this.logger.logError("Failed to fetch Google OAuth Tokens", (_a = error.response) === null || _a === void 0 ? void 0 : _a.data);
                throw new api_error_1.default(403, "Failed to fetch Google OAuth Tokens", error);
            }
        });
    }
    getGoogleUser(id_token, access_token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield axios_1.default.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
                    headers: {
                        Authorization: `Bearer ${id_token}`,
                    },
                });
                return res.data;
            }
            catch (error) {
                this.logger.logError("Failed to fetch Google User", error.message);
                throw new Error(error.message);
            }
        });
    }
}
exports.GoogleOAuthService = GoogleOAuthService;
