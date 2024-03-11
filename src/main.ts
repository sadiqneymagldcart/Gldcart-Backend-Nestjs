import "reflect-metadata";
import { App } from "./app";
import { InversifyExpressServer } from "inversify-express-utils";
import { Logger } from "./utils/logger";
import { container } from "./config/inversify.config";
import { AwsStorage } from "./storages/aws.storage";
import { CustomSocket } from "./socket";

const server = new InversifyExpressServer(container);
const app = new App(server, new Logger(), 3001);
app.start();

const socket = new CustomSocket(new AwsStorage(), new Logger(), 3002);
socket.start();

