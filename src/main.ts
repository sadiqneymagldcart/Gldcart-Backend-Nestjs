import "reflect-metadata";
import { App } from "./app";
import { InversifyExpressServer } from "inversify-express-utils";
import { Logger } from "./utils/logger";
import { container } from "./config/inversify.config";
import { AwsStorage } from "./storages/aws.storage";
import { CustomSocket } from "./socket";

const server = new InversifyExpressServer(container);
const logger = container.get<Logger>(Logger);
const awsStorage = container.get<AwsStorage>(AwsStorage);
const app = new App(3001, logger, server);
app.start().then(() => {
    new CustomSocket(awsStorage, logger, app.getHttpServer());
});
