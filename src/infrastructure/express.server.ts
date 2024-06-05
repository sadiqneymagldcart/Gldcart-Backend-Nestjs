import * as http from "http";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { Logger } from "@utils/logger";

@injectable()
class ExpressServer {
    private readonly server: http.Server;
    private readonly logger: Logger;
    private readonly port: number = 3001;
    private maxRetries: number = 3;
    private retryCount: number = 0;

    public constructor(
        @inject(Logger) logger: Logger,
        @inject(http.Server) server: http.Server,
    ) {
        this.logger = logger;
        this.server = server;
    }

    public start(): void {
        this.server.listen(this.port, () => {
            this.logger.logInfo(
                `⚡️[server]: Server is running on port ${this.port}`,
            );
        });

        this.server.on("error", (error: NodeJS.ErrnoException) => {
            this.handleServerError(error);
        });
    }

    private handleServerError(error: NodeJS.ErrnoException): void {
        if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            this.logger.logInfo(
                `Server failed to start. Retrying... (${this.retryCount}/${this.maxRetries})`,
            );
            setTimeout(() => this.start(), 1000);
        } else {
            this.logger.logError("Failed to start server", error);
            process.exit(1);
        }
    }
}

export { ExpressServer };
