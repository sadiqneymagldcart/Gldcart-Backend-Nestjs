import { InversifyExpressServer } from "inversify-express-utils";
import { Logger } from "./utils/logger";
import mongoose from "mongoose";
import { mongooseOptions } from "./config/mongo.config";
import { serverConfig } from "./config/server.config";
import { errorHandlerMiddleware } from "./middlewares/error.middleware";
import { loadEnvironmentVariables } from "./config/env.config";

export class App {
    private readonly port: string | number;
    private readonly logger: Logger;
    private readonly server: InversifyExpressServer;

    public constructor(
        server: InversifyExpressServer,
        logger: Logger,
        port: number,
    ) {
        loadEnvironmentVariables();
        this.validateEnvironmentVariables();
        this.port = port;
        this.server = server;
        this.logger = logger;
    }

    public async start() {
        try {
            await this.connectToDatabase();
            this.setupServer();
        } catch (error) {
            this.logger.logError("Server startup error: " + error.message, error);
            process.exit(1);
        }
    }

    private validateEnvironmentVariables() {
        if (!process.env.PORT || !process.env.DB_URL) {
            throw new Error("Environment variable PORT or DB_URL is not set");
        }
    }

    private async connectToDatabase(): Promise<void> {
        await mongoose.connect(process.env.DB_URL, mongooseOptions);
        this.logger.logInfo(
            `⚡️[database] MongoDB is running on port ${process.env.DB_PORT}`,
        );
    }

    private setupServer() {
        this.server.setConfig((app) => {
            serverConfig(app);
        });
        this.server.setErrorConfig((app) => {
            app.use(errorHandlerMiddleware);
        });
        const app = this.server.build();
        app.listen(this.port, () =>
            this.logger.logInfo(
                `⚡️[server]: Server is running at ${process.env.HOST}:${this.port} in ${process.env.NODE_ENV} mode`,
            ),
        );
    }
}
