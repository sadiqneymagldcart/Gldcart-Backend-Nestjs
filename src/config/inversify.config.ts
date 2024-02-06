import * as dotenv from "dotenv";
import { Container } from "inversify";
import { Logger } from "../utils/logger";
import { TokenService } from "../services/token/token.service";
import { AuthService } from "../services/auth/auth.service";
import { GoogleAuthService } from "../services/auth/google.auth.service";
import { MailService } from "../services/contact/mail.service";
import { PaymentService } from "../services/stripe/payment.service";
import Stripe from "stripe";
import { Transporter } from "nodemailer";
import { UserDetailsService } from "../services/user/user.details.service";
import { ReviewService } from "../services/shop/review.service";
import { configureNodemailer } from "./nodemailer.config";
import { ProductService } from "../services/shop/product.service";
import { ImageService } from "../services/shop/image.service";

//Controllers
import "../controllers/auth/auth.controller";
import "../controllers/auth/google.auth.controller";
import "../controllers/contact/contact.controller";
import "../controllers/user/user.controller";
import "../controllers/user/address.controller";
import "../controllers/stripe/payment.controller";
import "../controllers/shop/review.controller";
import "../controllers/shop/product.controller";

let path: string = ".env";
if (process.env.NODE_ENV === "production") {
    path = ".env.production";
}
dotenv.config({ path: path });

const container = new Container();

container.bind(Stripe).toDynamicValue(() => {
    return new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: "2023-08-16",
        typescript: true,
    });
});
container
    .bind<Transporter>("NodemailerTransporter")
    .toConstantValue(configureNodemailer());
container.bind(Logger).toSelf();
container.bind(TokenService).toSelf();
container.bind(AuthService).toSelf();
container.bind(GoogleAuthService).toSelf();
container.bind(MailService).toSelf();
container.bind(PaymentService).toSelf();
container.bind(UserDetailsService).toSelf();
container.bind(ReviewService).toSelf();
container.bind(ImageService).toSelf();
container.bind(ProductService).toSelf();

export { container };
