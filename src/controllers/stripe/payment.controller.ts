import * as express from "express";
import {PaymentService} from "../../services/stripe/payment.service";
import {inject} from "inversify";
import {controller, httpPost} from "inversify-express-utils";

@controller("/payment")
export class PaymentController {
    private readonly paymentService: PaymentService;

    constructor(@inject(PaymentService) paymentService: PaymentService) {
        this.paymentService = paymentService;
    }

    @httpPost("/create-customer")
    public async createCustomer(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ): Promise<void> {
        const {email, name} = request.body;
        try {
            const customerId = await this.paymentService.createCustomer(email, name);
            response.send(customerId);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/create-payment-intent")
    public async createPaymentCheckout(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ): Promise<void> {
        try {

            const checkoutUrl = await this.paymentService.createPaymentCheckout(
                request.body,
            );
            response.json({url: checkoutUrl});
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/webhook")
    public async webhook(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ): Promise<void> {
        try {
            const event = request.body;
            await this.paymentService.webhook(event);
            response.send({received: true});
        } catch (error) {
            next(error);
        }
    }
}
