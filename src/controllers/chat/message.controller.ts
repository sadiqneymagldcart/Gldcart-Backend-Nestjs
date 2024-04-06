import * as express from "express";
import { MessageService } from "@services/chat/message.service";
import { inject } from "inversify";
import {
    controller,
    httpGet,
    httpPost,
    httpPut,
} from "inversify-express-utils";

@controller("/message")
export class MessageController {
    private readonly messageService: MessageService;
    public constructor(@inject(MessageService) messageService: MessageService) {
        this.messageService = messageService;
    }

    @httpGet("/search")
    public async searchMessages(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const query = request.query.query as string;
            const userId = request.query.userId as string;
            const messages = await this.messageService.searchMessages(query, userId);
            response.json(messages);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/")
    public async createMessage(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const message = await this.messageService.createMessage(request.body);
            response.status(201).json(message);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/:chatId")
    public async getMessages(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const chatId = request.params.chatId;
            const messages = await this.messageService.getMessages(chatId);
            response.json(messages);
        } catch (error) {
            next(error);
        }
    }

    @httpPut("/:messageId")
    public async updateMessage(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const messageId = request.params.messageId;
            const message = await this.messageService.updateMessage(
                messageId,
                request.body,
            );
            response.json(message);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("")
    public async() { }
}
