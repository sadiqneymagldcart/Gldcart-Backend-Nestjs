import * as winston from "winston";
import { format } from "winston";
import winstonDailyRotateFile from "winston-daily-rotate-file";
import { ILogger } from "@interfaces/ILogger";
import { injectable } from "inversify";

export type LogMessage = string;

export type LogContext = object;

export enum LogLevel {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
}

@injectable()
export class Logger implements ILogger {
    private logger: winston.Logger;
    private readonly appName = process.env.APP_NAME || "GLD Cart";

    public constructor() {
        this.logger = this.initializeWinston();
    }

    public logInfo(msg: LogMessage, context?: LogContext) {
        this.log(msg, LogLevel.INFO, context);
    }

    public logWarn(msg: LogMessage, context?: LogContext) {
        this.log(msg, LogLevel.WARN, context);
    }

    public logError(msg: LogMessage, context?: LogContext) {
        this.log(msg, LogLevel.ERROR, context);
    }

    public logDebug(msg: LogMessage, context?: LogContext) {
        if (process.env.NODE_ENV !== "production") {
            this.log(msg, LogLevel.DEBUG, context);
        }
    }

    private log(msg: LogMessage, level: LogLevel, context?: LogContext) {
        this.logger.log(level, msg, { context });
    }

    private initializeWinston() {
        return winston.createLogger({
            transports: this.getTransports(),
        });
    }

    private getTransports() {
        const transports: Array<any> = [
            new winston.transports.Console({
                format: this.getFormatForConsole(),
            }),
        ];

        if (process.env.NODE_ENV === "production") {
            transports.push(this.getFileTransport());
        }

        return transports;
    }

    private getFormatForConsole() {
        return format.combine(
            format.timestamp(),
            format.printf(
                (info) =>
                    `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message
                    } [CONTEXT] -> ${info.context
                        ? "\n" +
                        JSON.stringify(info.context, this.getCircularReplacer(), 2)
                        : "{}"
                    }`,
            ),
            format.colorize({ all: true }),
        );
    }

    private getFileTransport() {
        return new winstonDailyRotateFile({
            filename: `${this.appName}-%DATE%.log`,
            zippedArchive: true,
            maxSize: "10m", 
            maxFiles: "14d", 
            format: format.combine(
                format.timestamp(),
                format((info) => {
                    info.app = this.appName;
                    return info;
                })(),
                format.json(),
            ),
        });
    }

    private getCircularReplacer() {
        const seen = new WeakSet();
        return (value: any) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    return "[Circular Reference]";
                }
                seen.add(value);
            }
            return value;
        };
    }
}
