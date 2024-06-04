import * as winston from "winston";
import {
    format,
    Logger as WinstonLogger,
    transport as WinstonTransport,
} from "winston";
import winstonDailyRotateFile from "winston-daily-rotate-file";
import { ILogger } from "@interfaces/ILogger";
import { injectable } from "inversify";
import { LogLevel } from "@ts/enums/log.level";

export type LogMessage = string;
export type LogContext = object;

@injectable()
export class Logger implements ILogger {
    private logger: WinstonLogger;
    private readonly appName: string;

    public constructor() {
        this.appName = process.env.APP_NAME || "GLD Cart";
        this.logger = this.initializeWinston();
    }

    public logInfo(msg: LogMessage, context?: LogContext): void {
        this.log(msg, LogLevel.INFO, context);
    }

    public logWarn(msg: LogMessage, context?: LogContext): void {
        this.log(msg, LogLevel.WARN, context);
    }

    public logError(msg: LogMessage, context?: LogContext): void {
        this.log(msg, LogLevel.ERROR, context);
    }

    public logDebug(msg: LogMessage, context?: LogContext): void {
        if (process.env.NODE_ENV !== "production") {
            this.log(msg, LogLevel.DEBUG, context);
        }
    }

    private log(msg: LogMessage, level: LogLevel, context?: LogContext): void {
        this.logger.log(level, msg, { context });
    }

    private initializeWinston(): WinstonLogger {
        return winston.createLogger({
            level: LogLevel.DEBUG, // Default log level
            transports: this.getTransports(),
        });
    }

    private getTransports(): WinstonTransport[] {
        const transports: WinstonTransport[] = [
            new winston.transports.Console({
                format: this.getConsoleFormat(),
            }),
        ];

        if (process.env.NODE_ENV === "production") {
            transports.push(this.getFileTransport());
        }

        return transports;
    }

    private getConsoleFormat() {
        return format.combine(
            format.timestamp(),
            format.printf(({ timestamp, level, message, context }) => {
                const contextString = context
                    ? JSON.stringify(context, this.getCircularReplacer(), 2)
                    : "{}";
                return `[${timestamp}] [${level.toUpperCase()}]: ${message} [CONTEXT] -> \n${contextString}`;
            }),
            format.colorize({ all: true }),
        );
    }

    private getFileTransport(): winstonDailyRotateFile {
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

    private getCircularReplacer(): (key: string, value: any) => any {
        const seen = new WeakSet();
        return (_key: string, value: any) => {
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
