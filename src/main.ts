import "reflect-metadata";
import { App } from "./app";
import { InversifyExpressServer } from "inversify-express-utils";
import { Logger } from "@utils/logger";
import { container } from "@/config/inversify.config";
import {ChatSocket} from "@sockets/chat.socket";

const logger = container.get<Logger>(Logger);
const server = new InversifyExpressServer(container);
const app = new App(3001, logger, server);
app.start().then(() => {
    new ChatSocket(logger, app.getHttpServer());
});
