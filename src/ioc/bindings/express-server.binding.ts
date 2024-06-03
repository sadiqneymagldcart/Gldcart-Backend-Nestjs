import { serverConfig } from "@config/server.config";
import { errorHandlerMiddleware } from "@middlewares/error.middleware";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";

function bindExpressServer(container: Container) {
    const express = new InversifyExpressServer(container)
        .setConfig((app) => {
            serverConfig(app);
        })
        .setErrorConfig((app) => {
            app.use(errorHandlerMiddleware);
        });

    container.bind(InversifyExpressServer).toConstantValue(express);
}

export { bindExpressServer };
