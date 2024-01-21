import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import {appConfig} from "./appConfig";
import {errorHandler} from "../middlewares/errorMiddleware";

export function initializeMiddlewares(app: express.Express) {
    app.set("trust proxy", 1);
    app.use(helmet());
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000,
            limit: 200,
        })
    );
    app.use('/webhook', bodyParser.raw({type: "*/*"}));
    app.use(express.json());
    app.use(
        express.urlencoded({
            extended: true,
        })
    );
    app.use(cookieParser());
    app.use(
        cors({
            origin: appConfig.CLIENT_URL,
            credentials: true,
        })
    );
    app.use(errorHandler);
}