import "reflect-metadata";
import { App } from "./app";
import { InversifyExpressServer } from "inversify-express-utils";
import { Logger } from "./utils/logger";
import { container } from "./config/inversify.config";
import { AwsStorage } from "./storages/aws.storage";
import { CustomSocket } from "./socket";

const server = new InversifyExpressServer(container);
const app = new App(3001, new Logger(), server);
app.start().then(() => {
    const httpServer = app.getHttpServer();
    const awsStorage = container.get<AwsStorage>(AwsStorage);
    const logger = container.get<Logger>(Logger);
    new CustomSocket(awsStorage, logger, httpServer);
});
