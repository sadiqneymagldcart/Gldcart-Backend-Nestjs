import { Container } from "inversify";
import { MongooseConnector } from "@infrastructure/mongoose.connector";

function bindMongooseConnector(container: Container): void {
    container.bind<MongooseConnector>(MongooseConnector).toSelf();
}

export { bindMongooseConnector };
