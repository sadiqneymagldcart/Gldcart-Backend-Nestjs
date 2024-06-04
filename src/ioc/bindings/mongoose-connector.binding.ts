import { Container } from "inversify";
import { MongooseConnector } from "@/infrastructure/db.connector";

function bindMongooseConnector(container: Container): void {
    container.bind<MongooseConnector>(MongooseConnector).toSelf();
}

export { bindMongooseConnector };
