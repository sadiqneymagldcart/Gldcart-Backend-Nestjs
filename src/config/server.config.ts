import * as express from "express";
import { Application } from "express";
import * as compression from "compression";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as hpp from "hpp";
import * as bodyParser from "body-parser";
import helmet from "helmet";

export function serverConfig(app: Application) {
    app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

    app.use("/payments/webhook", bodyParser.raw({ type: "*/*" }));

    app.use(hpp());

    app.use(helmet());

    app.use(compression());


    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    app.use(cookieParser());
}
