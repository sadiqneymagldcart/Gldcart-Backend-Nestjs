import * as http from "http";
import mongoose from "mongoose";
import { InversifyExpressServer } from "inversify-express-utils";
import { Logger } from "@utils/logger";
import { mongooseOptions } from "@config/mongo.config";
import { errorHandlerMiddleware } from "@middlewares/error.middleware";
import { serverConfig } from "@config/server.config";

export class App {
    private readonly _server: InversifyExpressServer;
    private readonly _logger: Logger;
    private readonly _port: number;
    private _httpServer!: http.Server;
    private _maxRetries: number = 3;
    private _retryCount: number = 0;

    public constructor(
        port: number,
        logger: Logger,
        server: InversifyExpressServer,
    ) {
        this._port = port;
        this._server = server;
        this._logger = logger;
    }

    public getHttpServer(): http.Server {
        return this._httpServer;
    }

    public async start(): Promise<void> {
        try {
            this.validateEnvironmentVariables();
            this.configureServer();
            this.initializeHttpServer();
            this.startListening();
            await this.initializeDbConnection();
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

    private async initializeDbConnection(): Promise<void> {
        try {
            await mongoose.connect(process.env.DB_URL!, mongooseOptions);
            this._logger.logInfo(`⚡️[database] Connected to ${process.env.DB_URL}`);
        } catch (error: any) {
            this._logger.logError("Error connecting to database", error);
            throw error;
        }
    }

    private configureServer(): void {
        this._server.setConfig((app) => {
            serverConfig(app);
        });
        this._server.setErrorConfig((app) => {
            app.use(errorHandlerMiddleware);
        });
    }

    private initializeHttpServer(): void {
        this._httpServer = http.createServer(this._server.build());
    }

    private startListening(): void {
        this._httpServer.listen(this._port, () => {
            this._logger.logInfo(
                `⚡️[server]: Server is running on port ${this._port}`,
            );
        });

        this._httpServer.on("error", (error: NodeJS.ErrnoException) => {
            this.handleServerError(error);
        });
    }

    private handleStartupError(error: Error): void {
        this._logger.logError("Server startup error: " + error.message, error);
        process.exit(1);
    }

    private handleServerError(error: NodeJS.ErrnoException): void {
        if (this._retryCount < this._maxRetries) {
            this._retryCount++;
            this._logger.logInfo(
                `Server failed to start. Retrying... (${this._retryCount}/${this._maxRetries})`,
            );
            setTimeout(() => this.startListening(), 1000);
        } else {
            this._logger.logError("Failed to start server", error);
            process.exit(1);
        }
    }
}
