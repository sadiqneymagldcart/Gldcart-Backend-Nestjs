import * as express from "express";
import {Application} from "express";
import {errorHandler} from "../middlewares/error.middleware";
import * as compression from "compression";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as hpp from "hpp";
import * as bodyParser from "body-parser";
import helmet from "helmet";

export async function serverConfig(app: Application) {
    app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

    app.use(hpp());

    app.use(helmet());

    app.use(compression());

    app.use("/webhook", bodyParser.raw({type: "*/*"}));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(cookieParser());

    app.use(errorHandler);
}
