import { Container } from "inversify/lib/container/container";
import { ChatSocket } from "./chat.socket";

function startSockets(container: Container)
{
  container.get<ChatSocket>(ChatSocket);
}

export { startSockets };
