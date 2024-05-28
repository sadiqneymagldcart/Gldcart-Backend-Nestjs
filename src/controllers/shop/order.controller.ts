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
import { authMiddleware } from "@middlewares/auth.middleware";

@controller("/order", authMiddleware)
export class OrderController implements Controller {
    private readonly orderService: OrderService;

    public constructor(@inject(OrderService) orderService: OrderService) {
        this.orderService = orderService;
    }

    @httpPost("/create-order")
    public async createOrder(
        request: express.Request,
        next: express.NextFunction,
    ) {
        try {
            return await this.orderService.createOrder(request.body);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/:userId")
    public async getOrderByUserId(
        request: express.Request,
        next: express.NextFunction,
    ) {
        const id = request.query.id as string;
        try {
            return await this.orderService.getOrder(id);
        } catch (error) {
            next(error);
        }
    }

    @httpPut("/update-order/:id")
    public async updateOrder(
        request: express.Request,
        next: express.NextFunction,
    ) {
        const id = request.params.id as string;
        const data = request.body;
        try {
            return await this.orderService.updateOrder(id, data);
        } catch (error) {
            next(error);
        }
    }

    @httpPut("/update-order-status/:id")
    public async updateOrderStatus(
        request: express.Request,
        next: express.NextFunction,
    ) {
        const id = request.params.id as string;
        const status = request.body.status;
        try {
            return await this.orderService.updateOrderStatus(id, status);
        } catch (error) {
            next(error);
        }
    }
}
