import * as http from "http";
import mongoose from "mongoose";
import { InversifyExpressServer } from "inversify-express-utils";
import { Logger } from "@utils/logger";
import { mongooseOptions } from "@config/mongo.config";
import { errorHandlerMiddleware } from "@middlewares/error.middleware";
import { serverConfig } from "@config/server.config";
import { ChatSocket } from "@sockets/chat.socket";

export class App {
    private readonly server: InversifyExpressServer;
    private readonly logger: Logger;
    private readonly port: number;
    private httpServer!: http.Server;
    private maxRetries: number = 3;
    private retryCount: number = 0;

    public constructor(
        port: number,
        logger: Logger,
        server: InversifyExpressServer,
    ) {
        this.port = port;
        this.server = server;
        this.logger = logger;
    }

    public getConfiguredServer(): http.Server {
        return this.httpServer;
    }

    public start(): void {
        try {
            this.validateEnvironmentVariables();
            this.configureExpressServer();
            this.createHttpServer();
            this.startListeningHttpServer();
            this.initializeDbConnection();
            this.initializeSockets();
        } catch (error: any) {
            this.handleStartupError(error);
        }
    }

    private validateEnvironmentVariables(): void {
        const requiredVariables = ["PORT", "DB_URL"];
        for (const variable of requiredVariables) {
            if (!process.env[variable]) {
                throw new Error(`Environment variable ${variable} is not set`);
            }
        }
    }

    private configureExpressServer(): void {
        this.server.setConfig((app) => {
            serverConfig(app);
        });
        this.server.setErrorConfig((app) => {
            app.use(errorHandlerMiddleware);
        });
    }

    private createHttpServer(): void {
        this.httpServer = http.createServer(this.server.build());
    }

    private startListeningHttpServer(): void {
        this.httpServer.listen(this.port, () => {
            this.logger.logInfo(
                `⚡️[server]: Server is running on port ${this.port}`,
            );
        });

        this.httpServer.on("error", (error: NodeJS.ErrnoException) => {
            this.handleServerError(error);
        });
    }

    private initializeDbConnection(): void {
        try {
            mongoose.connect(process.env.DB_URL!, mongooseOptions);
            this.logger.logInfo(`⚡️[database] Connected to ${process.env.DB_URL}`);
        } catch (error: any) {
            this.logger.logError("Error connecting to database", error);
            throw error;
        }
    }

    private initializeSockets(): void {
        new ChatSocket(this.logger, this.httpServer);
    }

    private handleStartupError(error: Error): void {
        this.logger.logError("Server startup error: " + error.message, error);
        process.exit(1);
    }

    private handleServerError(error: NodeJS.ErrnoException): void {
        if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            this.logger.logInfo(
                `Server failed to start. Retrying... (${this.retryCount}/${this.maxRetries})`,
            );
            setTimeout(() => this.startListeningHttpServer(), 1000);
        } else {
            this.logger.logError("Failed to start server", error);
            process.exit(1);
        }
    }
}
