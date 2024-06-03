import { Container } from "inversify";
import { bindMiddlewares } from "./middlewares.binding";
import { bindUserServices } from "./user-services.binding";
import { bindAuthServices } from "./auth-services.binding";
import { bindStorages } from "./storages.binding";
import { bindStripeServices } from "./stripe-services.binding";
import { bindMailServices } from "./mail-services.binding";
import { bindContactServices } from "./contact-services.binding";
import { bindUserInfoServices } from "./personal-services.binding";
import { bindShopServices } from "./shop-services.binding";
import { bindVerificationServices } from "./verification-services.binding";
import { bindChatServices } from "./chat-services.binding";
import { bindSockets } from "./sockets.binding";
import { bindLogger } from "./loggers.bindings";
import { bindExpressServer } from "./express-server.binding";

function bindAllDependencies(container: Container) {
    bindLogger(container);
    bindMiddlewares(container);
    bindSockets(container);
    bindUserServices(container);
    bindAuthServices(container);
    bindStorages(container);
    bindStripeServices(container);
    bindMailServices(container);
    bindContactServices(container);
    bindUserInfoServices(container);
    bindShopServices(container);
    bindVerificationServices(container);
    bindChatServices(container);
    bindExpressServer(container);
}

export { bindAllDependencies };
