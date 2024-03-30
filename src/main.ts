import "reflect-metadata";
import { App } from "./app";
import { InversifyExpressServer } from "inversify-express-utils";
import { Logger } from "./utils/logger";
import { container } from "./config/inversify.config";
import { CustomSocket } from "./socket";

const server = new InversifyExpressServer(container);

const logger = container.get<Logger>(Logger);

const app = new App(3001, logger, server);
app.start().then(() => {
    new CustomSocket(logger, app.getHttpServer());
});
