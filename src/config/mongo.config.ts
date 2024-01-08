import { ConnectOptions } from 'mongoose';
import mongoose from "mongoose";
import express from "express";
import {appConfig} from "./appConfig";

export const startMongoDb = (app: express.Express, mongooseInstance: typeof mongoose) => {
    const mongooseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions;

    if (!appConfig.DB_URL) {
        console.error("DB_URL environment variable is not defined.");
        process.exit(1);
    }
    mongooseInstance
        .connect(appConfig.DB_URL as string, mongooseOptions)
        .then(() => {
            app.listen(appConfig.DB_PORT, () => {
                console.log(`⚡️[database]: MongoDB is running on port ${appConfig.DB_PORT}`);
            });
        })
        .catch((error) => {
            console.error("Error connecting to the database:", error);
        });
}