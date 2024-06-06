import * as express from "express";
import { inject } from "inversify";
import { OrderService } from "@services/shop/order.service";
import {
    BaseHttpController,
    controller,
    httpGet,
    httpPost,
    httpPut,
} from "inversify-express-utils";
import { AuthenticationMiddleware } from "@middlewares/authentication.middleware";

@controller("/order", AuthenticationMiddleware)
export class OrderController extends BaseHttpController {
    private readonly orderService: OrderService;

    public constructor(@inject(OrderService) orderService: OrderService) {
        super();
        this.orderService = orderService;
    }

    @httpPost("/create-order")
    public async createOrder(request: express.Request) {
        const order = await this.orderService.createOrder(request.body);
        return this.json(order);
    }

    @httpGet("/:userId")
    public async getOrderByUserId(request: express.Request) {
        const id = request.query.id as string;
        const order = await this.orderService.getOrder(id);
        return this.json(order);
    }

    @httpPut("/update-order/:id")
    public async updateOrder(request: express.Request) {
        const id = request.params.id as string;
        const data = request.body;
        const updatedOrder = await this.orderService.updateOrder(id, data);
        return this.json(updatedOrder);
    }

    @httpPut("/update-order-status/:id")
    public async updateOrderStatus(request: express.Request) {
        const id = request.params.id as string;
        const status = request.body.status;
        const updatedStatus = await this.orderService.updateOrderStatus(id, status);
        return this.json(updatedStatus);
    }
}
