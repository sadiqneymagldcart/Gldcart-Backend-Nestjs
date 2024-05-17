import * as express from "express";
import { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import { rateLimitMiddlewareTyped } from "@middlewares/rate-limit.middleware";

export function serverConfig(app: Application) {
    app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

    app.use(rateLimitMiddlewareTyped);

    app.use("/payments/webhook", bodyParser.raw({ type: "*/*" }));

    app.use(hpp());

    app.use(helmet());

    app.use(compression());

    app.use(express.urlencoded({ extended: false }));

    app.use(express.json());

    app.use(cookieParser());
}
