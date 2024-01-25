import {ConnectOptions} from "mongoose";

export const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as ConnectOptions;
