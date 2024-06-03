import { configureNodemailer } from "@config/nodemailer.config";
import { MailService } from "@services/contact/mail.service";
import { Container } from "inversify";
import { Transporter } from "nodemailer";

function bindMailServices(container: Container) {
    container
        .bind<Transporter>("NodemailerTransporter")
        .toConstantValue(configureNodemailer());
    container.bind(MailService).toSelf();
}

export { bindMailServices };

