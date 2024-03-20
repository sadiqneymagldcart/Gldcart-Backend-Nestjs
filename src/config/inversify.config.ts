import Stripe from "stripe";
import { Container } from "inversify";
import { Logger } from "../utils/logger";
import { TokenService } from "../services/token/token.service";
import { AuthService } from "../services/auth/auth.service";
import { GoogleAuthService } from "../services/auth/google.auth.service";
import { MailService } from "../services/mail/mail.service";
import { StripeService } from "../services/stripe/payment.service";
import { Transporter } from "nodemailer";
import { ReviewService } from "../services/shop/review.service";
import { ProductService } from "../services/shop/product.service";
import { ProfessionalServicesService } from "../services/shop/professional-services.service";
import { AddressService } from "../services/user/address.service";
import { PasswordService } from "../services/user/reset.password.service";
import { ProfileService } from "../services/user/profile.service";
import { RentingService } from "../services/shop/renting.service";
import { VerificationService } from "../services/auth/verification.service";
import { CartService } from "../services/shop/cart.service";
import { WishlistService } from "../services/shop/wishlist.service";
import { OrderService } from "../services/shop/order.service";
import { OTPService } from "../services/auth/otp.service";
import { StripeSubscriptionService } from "../services/stripe/stripe.subscription.service";
import { StripeWebhookService } from "../services/stripe/stripe.webhook.service";
import { STRIPE_SECRET_KEY, stripeConfig } from "./stripe.config";
import { FileService } from "../services/shop/image.service";
import { AwsStorage } from "../storages/aws.storage";
import { SearchService } from "../services/shop/global.search.service";
import { ChatService } from "../services/chat/chat.service";

import { configureNodemailer } from "./nodemailer.config";
import { loadEnvironmentVariables } from "./env.config";

//Auth
import "../controllers/auth/auth.controller";
import "../controllers/auth/google.auth.controller";
//Shop
import "../controllers/shop/review.controller";
import "../controllers/shop/product.controller";
import "../controllers/shop/professional.services.controller";
import "../controllers/shop/renting.controller";
import "../controllers/shop/cart.controller";
import "../controllers/shop/global.search.controller";
import "../controllers/shop/order.controller";
//Contact
import "../controllers/contact/contact.controller";
//User info
import "../controllers/user/address.controller";
import "../controllers/user/profile.controller";
import "../controllers/user/reset.password.controller";
//Stripe
import "../controllers/stripe/payment.controller";
//Verification
import "../controllers/auth/verification.controller";
import "../controllers/shop/wishlist.controller";
import "../controllers/file.controller";
// Chat
import "../controllers/chat/chat.controller";
import "../controllers/chat/message.controller";
import { MessageService } from "../services/chat/message.service";

function bindAuthServices(container: Container) {
    container.bind(TokenService).toSelf();
    container.bind(AuthService).toSelf();
    container.bind(GoogleAuthService).toSelf();
}

function bindStripeServices(container: Container) {
    container.bind(Stripe).toDynamicValue(() => {
        return new Stripe(STRIPE_SECRET_KEY, stripeConfig);
    });
    container.bind(StripeService).toSelf();
    container.bind(StripeSubscriptionService).toSelf();
    container.bind(StripeWebhookService).toSelf();
}

function bindMailServices(container: Container) {
    container
        .bind<Transporter>("NodemailerTransporter")
        .toConstantValue(configureNodemailer());
    container.bind(MailService).toSelf();
}

function bindContactServices(container: Container) {
    container.bind(AddressService).toSelf();
}

function bindStorages(container: Container) {
    container.bind(AwsStorage).toSelf();
}

function bindUserInfoServices(container: Container) {
    container.bind(PasswordService).toSelf();
    container.bind(ProfileService).toSelf();
}

function bindShopServices(container: Container) {
    container.bind(ReviewService).toSelf();
    container.bind(FileService).toSelf();
    container.bind(ProductService).toSelf();
    container.bind(ProfessionalServicesService).toSelf();
    container.bind(RentingService).toSelf();
    container.bind(CartService).toSelf();
    container.bind(WishlistService).toSelf();
    container.bind(OrderService).toSelf();
    container.bind(SearchService).toSelf();
}

function bindVerificationService(container: Container) {
    container.bind(VerificationService).toSelf();
    container.bind(OTPService).toSelf();
}

function bindChatServices(container: Container) {
    container.bind(ChatService).toSelf();
    container.bind(MessageService).toSelf();
}

function initializeContainer(): Container {
    const container = new Container();
    container.bind(Logger).toSelf();
    return container;
}

loadEnvironmentVariables();
const container = initializeContainer();

bindAuthServices(container);
bindStorages(container);
bindStripeServices(container);
bindMailServices(container);
bindContactServices(container);
bindUserInfoServices(container);
bindShopServices(container);
bindVerificationService(container);
bindChatServices(container);

export { container };
