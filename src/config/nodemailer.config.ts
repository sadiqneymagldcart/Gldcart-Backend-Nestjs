import {createTransport, Transporter} from "nodemailer";

export const configureNodemailer = (): Transporter => {
    return createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_USER as string,
            pass: process.env.SMTP_USER_PASSWORD as string,
        },
    })
};
