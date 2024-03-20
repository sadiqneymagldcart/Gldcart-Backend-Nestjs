import * as express from "express";
import { StripeService } from "../../services/stripe/payment.service";
import { inject } from "inversify";
import { controller, httpPost } from "inversify-express-utils";
import { OrderService } from "../../services/shop/order.service";
import { ProductService } from "../../services/shop/product.service";
import { Logger } from "../../utils/logger";

@controller("/payments")
export class PaymentController {
    private readonly stripeService: StripeService;
    private readonly orderService: OrderService;
    private readonly productService: ProductService;
    private readonly logger: Logger;

    public constructor(
        @inject(StripeService) paymentService: StripeService,
        @inject(OrderService) orderService: OrderService,
        @inject(ProductService) productService: ProductService,
        @inject(Logger) logger: Logger,
    ) {
        this.stripeService = paymentService;
        this.orderService = orderService;
        this.productService = productService;
        this.logger = logger;
    }

    @httpPost("/create-customer")
    public async createCustomer(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ): Promise<void> {
        const { email, name } = request.body;
        try {
            const customerId = await this.stripeService.createCustomer(email, name);
            response.send(customerId);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/create-payment-checkout")
    public async createPaymentCheckout(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ): Promise<void> {
        try {
            const checkoutUrl = await this.stripeService.createPaymentCheckout(
                request.body,
            );
            response.json({ url: checkoutUrl });
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/create-payment-intent")
    public async createPaymentIntent(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ): Promise<void> {
        const { amount, currency, metadata } = request.body;
        try {
            const intent = await this.stripeService.createIntent(
                amount,
                currency,
                metadata,
            );
            response.json({ client_secret: intent.client_secret });
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
        const event = this.stripeService.createEvent(request);
        if (!event) {
            response.status(400).send(`Webhook Error: Invalid event`);
            return;
        }
        try {
            switch (event.type) {
                case "charge.succeeded":
                    const data = event.data.object;
                    await this.orderService.updateOrderStatus(
                        data.metadata.orderId,
                        "paid",
                    );
                    this.logger.logInfo(`Order ${data.metadata.orderId} paid`);
                    await this.productService.updateProductStock(
                        data.metadata.productId,
                        -data.metadata.quantity,
                    );
                    break;
                default:
                    break;
            }
            response.json({ received: true });
        } catch (error) {
            next(error);
        }
    }
    @httpPost("") public async() { }
}
