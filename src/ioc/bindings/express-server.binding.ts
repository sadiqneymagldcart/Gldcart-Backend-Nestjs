import { ExpressServer } from "@infrastructure/express.server";
import { Container } from "inversify";

function bindHttpServer(container: Container): void {
    container.bind<ExpressServer>(ExpressServer).toSelf();
}

export { bindHttpServer };
