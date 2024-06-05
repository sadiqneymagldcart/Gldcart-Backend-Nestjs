import * as http from "http";
import { baseServerMiddleware } from "@middlewares/base-server.middleware";
import { errorHandlerMiddleware } from "@middlewares/error.middleware";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";

function bindConfiguredHttpServer(container: Container) {
    const express = new InversifyExpressServer(container)
        .setConfig((app) => {
            baseServerMiddleware(app);
        })
        .setErrorConfig((app) => {
            app.use(errorHandlerMiddleware);
        })
        .build();

    const httpServer = http.createServer(express);

    container.bind<http.Server>(http.Server).toConstantValue(httpServer);
}

export { bindConfiguredHttpServer as bindExpressServer };
