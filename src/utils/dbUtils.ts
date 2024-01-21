import mongoose, {ConnectOptions} from "mongoose";
import {appConfig} from "../config/appConfig";
import {logger} from "./index";

export function connectToMongoDatabase() {

    const mongooseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions;

    if (!appConfig.DB_URL) {
        console.error("DB_URL environment variable is not defined.");
        process.exit(1);
    }
    mongoose
        .connect(appConfig.DB_URL as string, mongooseOptions)
        .then(() => {
            logger.logInfo(`⚡️[database]: MongoDB is running on port ${appConfig.DB_PORT}`);
        })
        .catch((error) => {
            logger.logError("Error connecting to the database:", error);
        });
}
