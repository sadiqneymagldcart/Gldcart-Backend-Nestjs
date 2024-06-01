import "reflect-metadata";
import { App } from "./app";
import { InversifyExpressServer } from "inversify-express-utils";
import { Logger } from "@utils/logger";
import { container } from "@config/inversify.config";


const logger = container.get<Logger>(Logger);

const express = new InversifyExpressServer(container);

const app = new App(express, logger, 3001);

app.start()
