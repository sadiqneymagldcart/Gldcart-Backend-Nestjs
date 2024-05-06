import { LogContext, LogMessage } from "@utils/logger";

export interface ILogger {
    logInfo(msg: LogMessage, context?: LogContext): void;

    logWarn(msg: LogMessage, context?: LogContext): void;

    logError(msg: LogMessage, context?: LogContext): void;

    logDebug(msg: LogMessage, context?: LogContext): void;
}
