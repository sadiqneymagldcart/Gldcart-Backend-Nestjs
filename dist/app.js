"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorMiddleware_1 = __importDefault(require("./middlewares/errorMiddleware"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const appConfig_1 = require("./config/appConfig");
const body_parser_1 = __importDefault(require("body-parser"));
const authRoutes_1 = require("./routes/authRoutes");
const passwordRoutes_1 = require("./routes/passwordRoutes");
const addressesRoutes_1 = require("./routes/addressesRoutes");
const emailRoutes_1 = require("./routes/emailRoutes");
const paymentRoutes_1 = require("./routes/paymentRoutes");
const personalDetailsRoutes_1 = require("./routes/personalDetailsRoutes");
const vehicleRoutes_1 = require("./routes/vehicleRoutes");
const webhookRoutes_1 = require("./routes/webhookRoutes");
const subscriptionRoutes_1 = require("./routes/subscriptionRoutes");
const cartRoutes_1 = require("./routes/cartRoutes");
exports.app = (0, express_1.default)();
exports.app.set("trust proxy", 1);
exports.app.use((0, helmet_1.default)());
exports.app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 200,
}));
exports.app.use('/webhook', body_parser_1.default.raw({ type: "*/*" }));
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({
    extended: true,
}));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, cors_1.default)({
    origin: appConfig_1.appConfig.CLIENT_URL,
    credentials: true,
}));
exports.app.use(authRoutes_1.authRoutes);
exports.app.use(passwordRoutes_1.passwordRoutes);
exports.app.use(addressesRoutes_1.addressesRoutes);
exports.app.use(emailRoutes_1.emailRoutes);
exports.app.use(paymentRoutes_1.paymentRoutes);
exports.app.use(personalDetailsRoutes_1.personalDetailRoutes);
exports.app.use(vehicleRoutes_1.vehicleRoutes);
exports.app.use(subscriptionRoutes_1.subscriptionRoutes);
exports.app.use(webhookRoutes_1.webhookRoutes);
exports.app.use(cartRoutes_1.cartRoutes);
exports.app.use(errorMiddleware_1.default);
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
if (!appConfig_1.appConfig.DB_URL) {
    console.error("DB_URL environment variable is not defined.");
    process.exit(1);
}
mongoose_1.default
    .connect(appConfig_1.appConfig.DB_URL, mongooseOptions)
    .then(() => {
    exports.app.listen(appConfig_1.appConfig.DB_PORT, () => {
        console.log(`⚡️[database]: MongoDB is running on port ${appConfig_1.appConfig.DB_PORT}`);
    });
})
    .catch((error) => {
    console.error("Error connecting to the database:", error);
});
