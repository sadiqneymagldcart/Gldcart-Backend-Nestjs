import { Container } from "inversify";
import { Logger } from "../utils/logger";
import { TokenService } from "../services/token/token.service";
import { AuthService } from "../services/auth/auth.service";
import { GoogleAuthService } from "../services/auth/google.auth.service";
import { MailService } from "../services/contact/mail.service";
import { PaymentService } from "../services/stripe/payment.service";
import Stripe from "stripe";
import { Transporter } from "nodemailer";
import { ReviewService } from "../services/shop/review.service";
import { configureNodemailer } from "./nodemailer.config";
import { ProductService } from "../services/shop/product.service";
import { ImageService } from "../services/shop/image.service";
import { ProfessionalServicesService } from "../services/shop/professional-services.service";
import { AddressService } from "../services/user_info/address.service";
import { PasswordService } from "../services/user_info/reset.password.service";
import { loadEnvironmentVariables } from "./env.config";

//Auth
import "../controllers/auth/auth.controller";
import "../controllers/auth/google.auth.controller";

//Shop
import "../controllers/shop/review.controller";
import "../controllers/shop/product.controller";
import "../controllers/shop/professional.services.controller";

//Contact
import "../controllers/contact/contact.controller";

//User info
import "../controllers/user_info/address.controller";
import "../controllers/user_info/profile.controller";
import "../controllers/user_info/reset.password.controller";

//Stripe
import "../controllers/stripe/payment.controller";
import { ProfileService } from "../services/user_info/profile.service";



function bindAuthServices(container: Container) {
    container.bind(TokenService).toSelf();
    container.bind(AuthService).toSelf();
    container.bind(GoogleAuthService).toSelf();
}

function bindStripeServices(container: Container) {
    container.bind(Stripe).toDynamicValue(() => {
        return new Stripe(process.env.STRIPE_SECRET_KEY as string, {
            apiVersion: "2023-08-16",
            typescript: true,
        });
    });
    container.bind(PaymentService).toSelf();
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

export { container };
