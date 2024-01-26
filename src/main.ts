import {App} from "./app";
import {InversifyExpressServer} from "inversify-express-utils";
import {Logger} from "./utils/logger";
import * as dotenv from "dotenv";
import {container} from "./config/inversify.config";

dotenv.config();

const server = new InversifyExpressServer(container);
new App(server, new Logger()).start();
