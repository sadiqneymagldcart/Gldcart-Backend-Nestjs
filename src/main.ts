import "reflect-metadata";
import { Server } from "./server";
import { InversifyExpressServer } from "inversify-express-utils";
import { Logger } from "@utils/logger";
import { container } from "@/config/inversify.config";
import { ChatSocket } from "@sockets/chat.socket";

const logger = container.get<Logger>(Logger);

const express = new InversifyExpressServer(container);

const server = new Server(3001, logger, express);
server.start().then(() => {
    new ChatSocket(logger, server.getConfiguredServer());
});
