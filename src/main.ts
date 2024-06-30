import "reflect-metadata";
import { Logger } from "@utils/logger";
import { ExpressServer } from "@infrastructure/express.server";
import { MongooseConnector } from "@infrastructure/mongoose.connector";
import { startSockets } from "./sockets";
import { getConfiguredContainer } from "@ioc/container";

function bootstrap() {
    const container = getConfiguredContainer();
    const logger = container.get<Logger>(Logger);
    const expressServer = container.get<ExpressServer>(ExpressServer);
    const mongooseConnector = container.get<MongooseConnector>(MongooseConnector);

    try {
        mongooseConnector.connect();
        expressServer.start();
        startSockets(container, logger);
    } catch (error: any) {
        logger.logError("Application failed to start", error);
        process.exit(1);
    }
}

bootstrap();
