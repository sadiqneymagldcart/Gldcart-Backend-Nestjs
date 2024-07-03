import { Container } from "inversify";
import { Logger } from "../utils/logger";
import { TokenService } from "../services/token/token.service";
import { AuthService } from "../services/auth/auth.service";
import { GoogleAuthService } from "../services/auth/google.auth.service";
import { MailService } from "../services/mail/mail.service";
import { PaymentService } from "../services/stripe/payment.service";
import Stripe from "stripe";
import { Transporter } from "nodemailer";
import { ReviewService } from "../services/shop/review.service";
import { ProductService } from "../services/shop/product.service";
import { ImageService } from "../services/shop/image.service";
import { ProfessionalServicesService } from "../services/shop/professional-services.service";
import { AddressService } from "../services/user_info/address.service";
import { PasswordService } from "../services/user_info/reset.password.service";
import { ProfileService } from "../services/user_info/profile.service";
import { RentingService } from "../services/shop/renting.service";
import { VerificationService } from "../services/auth/verification.service";
import { CartService } from "../services/shop/cart.service";
import { WishlistService } from "../services/shop/wishlist.service";
import { OrderService } from "../services/shop/order.service";
import { OTPService } from "../services/auth/otp.service";
import { StripeSubscriptionService } from "../services/stripe/stripe.subscription.service";
import { StripeWebhookService } from "../services/stripe/stripe.webhook.service";

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

//Contact
import "../controllers/contact/contact.controller";

//User info
import "../controllers/user_info/address.controller";
import "../controllers/user_info/profile.controller";
import "../controllers/user_info/reset.password.controller";

//Stripe
import "../controllers/stripe/payment.controller";
//Verification
import "../controllers/auth/verification.controller";
import "../controllers/shop/wishlist.controller";

import {STRIPE_SECRET_KEY, stripeConfig} from "./stripe.config";


function bindAuthServices(container: Container) {
    container.bind(TokenService).toSelf();
    container.bind(AuthService).toSelf();
    container.bind(GoogleAuthService).toSelf();
}

function bindStripeServices(container: Container) {
    container.bind(Stripe).toDynamicValue(() => {
        return new Stripe(STRIPE_SECRET_KEY, stripeConfig);
    });
    container.bind(PaymentService).toSelf();
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

function bindUserInfoServices(container: Container) {
    container.bind(PasswordService).toSelf();
    container.bind(ProfileService).toSelf();
}

function bindShopServices(container: Container) {
    container.bind(ReviewService).toSelf();
    container.bind(ImageService).toSelf();
    container.bind(ProductService).toSelf();
    container.bind(ProfessionalServicesService).toSelf();
    container.bind(RentingService).toSelf();
    container.bind(CartService).toSelf();
    container.bind(WishlistService).toSelf();
    container.bind(OrderService).toSelf();
}

function bindVerificationService(container: Container) {
    container.bind(VerificationService).toSelf();
    container.bind(OTPService).toSelf();
}

function initializeContainer(): Container {
    const container = new Container();
    container.bind(Logger).toSelf();
    return container;
}

loadEnvironmentVariables();

const container = initializeContainer();
bindAuthServices(container);
bindStripeServices(container);
bindMailServices(container);
bindContactServices(container);
bindUserInfoServices(container);
bindShopServices(container);
bindVerificationService(container);

export { container };
