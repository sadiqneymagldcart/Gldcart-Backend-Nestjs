import * as express from "express";
import { inject } from "inversify";
import { OrderService } from "../../services/shop/order.service";
import { controller, httpGet, httpPost } from "inversify-express-utils";

@controller("/order")
export class OrderController {
    private readonly orderService: OrderService;

    public constructor(@inject(OrderService) orderService: OrderService) {
        this.orderService = orderService;
    }

    @httpPost("/create-order")
    public async createOrder(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ): Promise<void> {
        try {
            const order = await this.orderService.createOrder(request.body);
            response.status(201).json(order);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/:userId")
    public async getOrderByUserId(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ): Promise<void> {
        const id = request.query.id as string;
        try {
            const order = await this.orderService.getOrder(id);
            response.json(order);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/update-order")
    public async updateOrder(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ): Promise<void> {
        try {
            const id = request.query.id as string;
            const data = request.body;
            const order = await this.orderService.updateOrder(id, data);
            response.json(order);
        } catch (error) {
            next(error);
        }
    }
}
