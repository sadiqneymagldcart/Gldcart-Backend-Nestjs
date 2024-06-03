import { Logger } from "@utils/logger";
import { Container } from "inversify";

function bindLogger(container: Container): void {
  container.bind(Logger).toSelf();
}

export { bindLogger };
