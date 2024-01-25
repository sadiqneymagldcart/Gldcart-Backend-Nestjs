import {Container} from "inversify";
import {Logger} from "../utils/logger";
import {JwtService} from "../services/token/jwt.service";
import {TokenService} from "../services/token/token.service";
import {AuthService} from "../services/auth/auth.service";
import {GoogleAuthService} from "../services/auth/google.auth.service";
import {MailService} from "../services/contact/mail.service";
import {PaymentService} from "../services/stripe/payment.service";
import Stripe from "stripe";
import {Transporter} from "nodemailer";
import {configureNodemailer} from "./nodemailer.config";
import {UserDetailsService} from "../services/user/user.details.service";

//Controllers
import "../controllers/auth/auth.controller";
import "../controllers/contact/contact.controller";
import "../controllers/user/user.controller";
import "../controllers/user/address.controller";
import "../controllers/stripe/payment.controller";


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
container.bind(JwtService).toSelf();
container.bind(TokenService).toSelf();
container.bind(AuthService).toSelf();
container.bind(GoogleAuthService).toSelf();
container.bind(MailService).toSelf();
container.bind(PaymentService).toSelf();
container.bind(UserDetailsService).toSelf();

export {container};
