import "reflect-metadata";
import * as http from "http";
import { container } from "@ioc/container";
import { Logger } from "@utils/logger";
import { App } from "./app";
import { startSockets } from "./sockets";

const logger = container.get<Logger>(Logger);

const server = container.get<http.Server>(http.Server);

const app = new App(server, logger, 3001);

app.start();

startSockets(container);
