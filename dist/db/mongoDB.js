"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class MongoDatabase {
    constructor(app) {
        this.mongooseOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        this.app = app;
    }
    connectToDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!process.env.DB_URL) {
                    throw new Error("DB_URL environment variable is not defined.");
                }
                yield mongoose_1.default.connect(process.env.DB_URL, this.mongooseOptions).then(() => {
                    this.app.listen(process.env.DB_PORT, () => {
                        console.log(`DB is running on port ${process.env.DB_PORT}`);
                    });
                });
                console.log("Connection has been established successfully.");
            }
            catch (error) {
                console.error("Unable to connect to the Database:", error);
            }
        });
    }
}
exports.default = MongoDatabase;
