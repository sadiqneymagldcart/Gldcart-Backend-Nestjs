import * as express from "express";
import { inject } from "inversify";
import { OrderService } from "@services/shop/order.service";
import {
    Controller,
    controller,
    httpGet,
    httpPost,
    httpPut,
} from "inversify-express-utils";
import { requireAuth } from "@middlewares/auth.middleware";

@controller("/order")
export class OrderController implements Controller {
    private readonly orderService: OrderService;

    public constructor(@inject(OrderService) orderService: OrderService) {
        this.orderService = orderService;
    }

    @httpPost("/create-order", requireAuth)
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

    @httpGet("/:userId", requireAuth)
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

    @httpPut("/update-order/:id", requireAuth)
    public async updateOrder(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ): Promise<void> {
        const id = request.params.id as string;
        const data = request.body;

        try {
            const order = await this.orderService.updateOrder(id, data);
            response.json(order);
        } catch (error) {
            next(error);
        }
    }

    @httpPut("/update-order-status/:id", requireAuth)
    public async updateOrderStatus(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ): Promise<void> {
        const id = request.params.id as string;
        const status = request.body.status;
        try {
            const order = await this.orderService.updateOrderStatus(id, status);
            response.json(order);
        } catch (error) {
            next(error);
        }
    }
}
