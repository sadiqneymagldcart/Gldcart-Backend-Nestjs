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
exports.Logger = exports.LogLevel = void 0;
const winston_1 = __importStar(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "debug";
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class Logger {
    constructor() {
        this._logger = this._initializeWinston();
    }
    logInfo(msg, context) {
        return __awaiter(this, void 0, void 0, function* () {
            this._log(msg, LogLevel.INFO, context);
        });
    }
    logWarn(msg, context) {
        return __awaiter(this, void 0, void 0, function* () {
            this._log(msg, LogLevel.WARN, context);
        });
    }
    logError(msg, context) {
        return __awaiter(this, void 0, void 0, function* () {
            this._log(msg, LogLevel.ERROR, context);
        });
    }
    logDebug(msg, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.NODE_ENV !== 'production') {
                this._log(msg, LogLevel.DEBUG, context);
            }
        });
    }
    _log(msg, level, context) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.log(level, msg, { context: context });
        });
    }
    _initializeWinston() {
        return winston_1.default.createLogger({
            transports: Logger._getTransports(),
        });
    }
    static _getTransports() {
        const transports = [
            new winston_1.default.transports.Console({
                format: this._getFormatForConsole(),
            }),
        ];
        if (process.env.NODE_ENV === 'production') {
            transports.push(this._getFileTransport());
        }
        return transports;
    }
    static _getFormatForConsole() {
        return winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.printf(info => `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message} [CONTEXT] -> ${info.context ? '\n' + JSON.stringify(info.context, null, 2) : '{}'}`), winston_1.format.colorize({ all: true }));
    }
    static _getFileTransport() {
        return new winston_daily_rotate_file_1.default({
            filename: `${Logger._appName}-%DATE%.log`,
            zippedArchive: true,
            maxSize: '10m', // Rotate after 10MB
            maxFiles: '14d', // Only keep last 14 days
            format: winston_1.format.combine(winston_1.format.timestamp(), (0, winston_1.format)(info => {
                console.log(info);
                info.app = this._appName;
                return info;
            })(), winston_1.format.json()),
        });
    }
}
exports.Logger = Logger;
Logger._appName = 'GLD Cart';
