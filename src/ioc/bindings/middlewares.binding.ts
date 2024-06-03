import { AuthenticationMiddleware } from "@middlewares/authentication.middleware";
import { SubscriptionMiddlware } from "@middlewares/subscription.middleware";
import { Container } from "inversify";

function bindMiddlewares(container: Container) {
    container.bind(AuthenticationMiddleware).toSelf();
    container.bind(SubscriptionMiddlware).toSelf();
}

export { bindMiddlewares };

