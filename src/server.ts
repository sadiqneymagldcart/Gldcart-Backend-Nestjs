import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
import { serverConfig } from "./config/server.config";
import { Container } from "inversify";
import { makeLoggerMiddleware } from "inversify-logger-middleware";
import "../controllers/auth/authController";
import { Logger } from "./utils/logger";
import { JwtService } from "./services/token/jwtService";
import { TokenService } from "./services/token/tokenService";
import { AuthService } from "./services/auth/authService";
import { GoogleAuthService } from "./services/auth/googleAuthService";


const port = process.env.PORT || 3000;

export const container = new Container();

const bindServicesToContainer = () => {
  if (process.env.NODE_ENV === "development") {
    const logger = makeLoggerMiddleware();
    container.applyMiddleware(logger);
  }

  container.bind(Logger).toSelf();
  container.bind(JwtService).toSelf();
  container.bind(TokenService).toSelf();
  container.bind(AuthService).toSelf();
  container.bind(GoogleAuthService).toSelf();
};

function startServer(port: string | number) {
  const server = new InversifyExpressServer(container, null, {
    rootPath: "/api",
  });
  server.setConfig(serverConfig);
  const app = server.build();
  app.listen(port, () =>
    new Logger().logInfo("Server up on http://127.0.0.1:3000/"),
  );
}

bindServicesToContainer();
startServer(port);
