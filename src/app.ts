import express, {Express} from "express";
import mongoose from "mongoose";
import {startMongoDb} from "./config/mongo.config";
import {setupMiddlewares} from "./config/middlewares.config";

export const app: Express = express();

setupMiddlewares(app);
startMongoDb(app, mongoose);