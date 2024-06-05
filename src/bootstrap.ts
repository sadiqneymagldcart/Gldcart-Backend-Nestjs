import "reflect-metadata";
import { container } from "@ioc/container";
import { Logger } from "@utils/logger";
import { ExpressServer } from "@infrastructure/express.server";
import { MongooseConnector } from "@infrastructure/mongoose.connector";
import { startSockets } from "./sockets";

function bootstrap() {
    const logger = container.get<Logger>(Logger);
    const expressServer = container.get<ExpressServer>(ExpressServer);
    const mongooseConnector = container.get<MongooseConnector>(MongooseConnector);

    try {
        mongooseConnector.initializeDbConnection();
        expressServer.start();
        startSockets(container, logger);
    } catch (error: any) {
        logger.logError("Application failed to start", error);
        process.exit(1);
    }
}

export { bootstrap };
