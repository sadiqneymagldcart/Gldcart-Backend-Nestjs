import { Container } from "inversify";
import { loadEnvironmentVariables } from "@config/env.config";
import { bindAllDependencies } from "./bindings";

// Lazy load controllers
import "@controllers/auth/auth.controller";
import "@controllers/auth/google-auth.controller";
import "@controllers/shop/review.controller";
import "@controllers/shop/product.controller";
import "@controllers/shop/professional.services.controller";
import "@controllers/shop/renting.controller";
import "@controllers/shop/cart.controller";
import "@controllers/shop/global.search.controller";
import "@controllers/shop/order.controller";
import "@controllers/contact/contact.controller";
import "@controllers/personal/address.controller";
import "@controllers/personal/profile.controller";
import "@controllers/personal/reset-password.controller";
import "@controllers/payment/payment.controller";
import "@controllers/auth/verification.controller";
import "@controllers/shop/wishlist.controller";
import "@controllers/files/file.controller";
import "@controllers/chat/chat.controller";
import "@controllers/chat/message.controller";

export function getConfiguredContainer(): Container {
    loadEnvironmentVariables();

    const container = new Container();

    bindAllDependencies(container);

    return container;
}


