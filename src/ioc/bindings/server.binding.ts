import { HttpServer } from "@/infrastructure/server";
import { Container } from "inversify";

function bindHttpServer(container: Container): void {
    container.bind<HttpServer>(HttpServer).toSelf();
}

export { bindHttpServer };
