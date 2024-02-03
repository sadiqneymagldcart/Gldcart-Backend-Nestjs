import "reflect-metadata";
import { App } from "./app";
import { InversifyExpressServer } from "inversify-express-utils";
import { Logger } from "./utils/logger";
import { container } from "./config/inversify.config";

const server = new InversifyExpressServer(container);
const app = new App(server, new Logger());
app.start();
