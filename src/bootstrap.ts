import "reflect-metadata";
import { container } from "@ioc/container";
import { Logger } from "@utils/logger";
import { HttpServer } from "@infrastructure/server";
import { MongooseConnector } from "@infrastructure/db.connector";
import { startSockets } from "./sockets";

function bootstrap() {
    const logger = container.get<Logger>(Logger);
    const httpServer = container.get<HttpServer>(HttpServer);
    const mongooseConnector = container.get<MongooseConnector>(MongooseConnector);

    try {
        mongooseConnector.initializeDbConnection();
        httpServer.start();
        startSockets(container, logger);
    } catch (error: any) {
        logger.logError("Application failed to start", error);
        process.exit(1);
    }
}

export { bootstrap };
