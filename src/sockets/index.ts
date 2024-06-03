import { Container } from "inversify/lib/container/container";
import { ChatSocket } from "./chat.socket";
import { Logger } from "@utils/logger";

function startSockets(container: Container, logger: Logger) {
  container.get<ChatSocket>(ChatSocket);
  logger.logInfo("⚡️[socket]: Sockets started");
}

export { startSockets };
