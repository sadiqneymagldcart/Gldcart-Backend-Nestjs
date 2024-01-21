"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
var inversify_express_utils_1 = require("inversify-express-utils");
var server_config_1 = require("./config/server.config");
var inversify_1 = require("inversify");
var inversify_logger_middleware_1 = require("inversify-logger-middleware");
require("../controllers/auth/authController");
var logger_1 = require("./utils/logger");
var jwtService_1 = require("./services/token/jwtService");
var tokenService_1 = require("./services/token/tokenService");
var authService_1 = require("./services/auth/authService");
var googleAuthService_1 = require("./services/auth/googleAuthService");
var port = process.env.PORT || 3000;
exports.container = new inversify_1.Container();
var bindServicesToContainer = function () {
    if (process.env.NODE_ENV === "development") {
        var logger = (0, inversify_logger_middleware_1.makeLoggerMiddleware)();
        exports.container.applyMiddleware(logger);
    }
    exports.container.bind(logger_1.Logger).toSelf();
    exports.container.bind(jwtService_1.JwtService).toSelf();
    exports.container.bind(tokenService_1.TokenService).toSelf();
    exports.container.bind(authService_1.AuthService).toSelf();
    exports.container.bind(googleAuthService_1.GoogleAuthService).toSelf();
};
function startServer(port) {
    var server = new inversify_express_utils_1.InversifyExpressServer(exports.container, null, {
        rootPath: "/api",
    });
    server.setConfig(server_config_1.serverConfig);
    var app = server.build();
    app.listen(port, function () {
        return new logger_1.Logger().logInfo("Server up on http://127.0.0.1:3000/");
    });
}
bindServicesToContainer();
startServer(port);
