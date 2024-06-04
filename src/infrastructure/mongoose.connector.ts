import { inject, injectable } from "inversify";
import "reflect-metadata";
import mongoose from "mongoose";
import { Logger } from "@utils/logger";
import { mongooseOptions } from "@config/mongo.config";

@injectable()
class MongooseConnector {
    private readonly logger: Logger;
    private readonly url: string = process.env.DB_URL!;

    public constructor(
        @inject(Logger) logger: Logger
    ) {
        this.logger = logger;
    }

    public initializeDbConnection(): void {
        try {
            mongoose.connect(this.url, mongooseOptions);
            this.logger.logInfo(`⚡️[database] Connected to ${process.env.DB_URL}`);
        } catch (error: any) {
            this.logger.logError("Error connecting to database", error);
            throw error;
        }
    }
}

export { MongooseConnector };
