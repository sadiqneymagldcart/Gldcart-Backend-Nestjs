"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var helmet_1 = __importDefault(require("helmet"));
var hpp_1 = __importDefault(require("hpp"));
var compression_1 = __importDefault(require("compression"));
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
var swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
var dbUtils_1 = require("./utils/dbUtils");
var errorMiddleware_1 = require("./middlewares/errorMiddleware");
var inversify_express_utils_1 = require("inversify-express-utils");
var Server = /** @class */ (function () {
    function Server(container, port) {
        this.server = new inversify_express_utils_1.InversifyExpressServer(container);
        this.port = port || 3000;
        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeSwagger();
        this.initializeErrorHandling();
    }
    Server.prototype.listen = function () {
        this.server.build().listen(this.port, function () { });
    };
    Server.prototype.getServer = function () {
        return this.server;
    };
    Server.prototype.connectToDatabase = function () {
        (0, dbUtils_1.connectToMongoDatabase)();
    };
    Server.prototype.initializeMiddlewares = function () {
        this.server.setConfig(function (app) {
            app.use((0, cors_1.default)({ origin: process.env.CLIENT_URL, credentials: true }));
            app.use((0, hpp_1.default)());
            app.use((0, helmet_1.default)());
            app.use((0, compression_1.default)());
            app.use(express_1.default.json());
            app.use(express_1.default.urlencoded({ extended: true }));
            app.use((0, cookie_parser_1.default)());
            app.use(errorMiddleware_1.errorHandler);
        });
    };
    Server.prototype.initializeSwagger = function () {
        var options = {
            swaggerDefinition: {
                info: {
                    title: "REST API",
                    version: "1.0.0",
                    description: "Example docs",
                },
            },
            apis: ["swagger.yaml"],
        };
        var specs = (0, swagger_jsdoc_1.default)(options);
        this.app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
    };
    return Server;
}());
exports.Server = Server;
