import {ConnectOptions} from "mongoose";

interface MongoConfig {
    DB_URL?: string;
    DB_PORT: number | string;
}

const mongoConfig: MongoConfig = {
    DB_URL: process.env.DB_URL,
    DB_PORT: process.env.DB_PORT || 27017,
};

export const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as ConnectOptions;
