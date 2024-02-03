import * as express from "express";
import {PaymentService} from "../../services/stripe/payment.service";
import {inject} from "inversify";
import {controller, httpPost} from "inversify-express-utils";
import {ICheckoutRequestBody} from "../../interfaces/ICheckoutRequestBody";

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
        const requestBody = request.body as ICheckoutRequestBody;
        try {
            const checkoutUrl = await this.paymentService.createPaymentCheckout(
                requestBody,
            );
            response.json({url: checkoutUrl});
        } catch (error) {
            next(error);
        }
    }
}