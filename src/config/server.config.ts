import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import hpp from "hpp";
import { errorHandler } from "../middlewares/errorMiddleware";

export async function serverConfig(app: Application) {
    app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
    app.use(hpp());
    app.use(helmet());
    app.use(compression());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(errorHandler);
}
