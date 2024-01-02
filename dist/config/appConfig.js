"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.appConfig = {
    PORT: process.env.PORT || 5000,
    DB_URL: process.env.DB_URL,
    CLIENT_URL: process.env.CLIENT_URL,
    DB_PORT: process.env.DB_PORT || 27017,
};
