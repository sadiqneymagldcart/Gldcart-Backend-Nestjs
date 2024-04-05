import "reflect-metadata";
import { App } from "./app";
import { InversifyExpressServer } from "inversify-express-utils";
import { Logger } from "@utils/logger";
import { CustomSocket } from "./socket";
import { container } from "@/config/inversify.config";

const server = new InversifyExpressServer(container);

const logger = container.get<Logger>(Logger);

const app = new App(3001, logger, server);
app.start().then(() => {
    new CustomSocket(logger, app.getHttpServer());
});
