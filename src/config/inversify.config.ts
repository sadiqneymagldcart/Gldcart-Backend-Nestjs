import Stripe from "stripe";
import { Container } from "inversify";
import { Logger } from "@utils/logger";
import { configureNodemailer } from "./nodemailer.config";
import { loadEnvironmentVariables } from "./env.config";
import { STRIPE_SECRET_KEY, stripeConfig } from "./stripe.config";
import { Transporter } from "nodemailer";

// Middlewares
import { AuthenticationMiddleware } from "@middlewares/auth.middleware";


// Services
import { TokenService } from "@services/token/token.service";
import { AuthService } from "@services/auth/auth.service";
import { GoogleAuthService } from "@services/auth/google-auth.service";
import { MailService } from "@services/contact/mail.service";
import { StripeService } from "@services/payment/stripe.service";
import { ReviewService } from "@services/shop/review.service";
import { ProductService } from "@services/shop/product.service";
import { ProfessionalServicesService } from "@services/shop/professional-services.service";
import { AddressService } from "@services/personal/address.service";
import { PasswordService } from "@services/personal/reset-password.service";
import { ProfileService } from "@services/personal/profile.service";
import { RentingService } from "@services/shop/renting.service";
import { VerificationService } from "@services/verification/verification.service";
import { CartService } from "@services/shop/cart.service";
import { WishlistService } from "@services/shop/wishlist.service";
import { OrderService } from "@services/shop/order.service";
import { StripeSubscriptionService } from "@services/payment/stripe-subscription.service";
import { StripeWebhookService } from "@services/payment/stripe-webhook.service";
import { FileService } from "@services/shop/image.service";
import { AwsStorage } from "@/storages/aws.storage";
import { SearchService } from "@services/shop/global-search.service";
import { ChatService } from "@services/chat/chat.service";
import { MessageService } from "@services/chat/message.service";
import { TestService } from "@services/base/test.service";

// Controllers
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
import "@controllers/files/test.controller"

function bindAuthServices(container: Container) {
    container.bind(TokenService).toSelf();
    container.bind(AuthService).toSelf();
    container.bind(GoogleAuthService).toSelf();
}

function bindMiddlewares(container: Container) {
    container.bind(AuthenticationMiddleware).toSelf();
}

function bindStripeServices(container: Container) {
    container.bind(Stripe).toDynamicValue(() => new Stripe(STRIPE_SECRET_KEY as string, stripeConfig));
    container.bind(StripeService).toSelf();
    container.bind(StripeSubscriptionService).toSelf();
    container.bind(StripeWebhookService).toSelf();
}

function bindMailServices(container: Container) {
    container.bind<Transporter>("NodemailerTransporter").toConstantValue(configureNodemailer());
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

function bindVerificationServices(container: Container) {
    container.bind(VerificationService).toSelf();
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

function configureContainer(container: Container) {
    bindMiddlewares(container);
    bindAuthServices(container);
    bindStorages(container);
    bindStripeServices(container);
    bindMailServices(container);
    bindContactServices(container);
    bindUserInfoServices(container);
    bindShopServices(container);
    bindVerificationServices(container);
    bindChatServices(container);
    container.bind(TestService).toSelf();
    
}

loadEnvironmentVariables();

const container = initializeContainer();
configureContainer(container);

export { container };

