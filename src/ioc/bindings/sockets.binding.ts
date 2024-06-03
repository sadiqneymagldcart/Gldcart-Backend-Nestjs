import { ChatSocket } from "@sockets/chat.socket";
import { Container } from "inversify";

function bindSockets(container: Container) {
    container.bind(ChatSocket).toSelf();
}

export { bindSockets };

