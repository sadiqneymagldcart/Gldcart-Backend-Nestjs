import * as express from "express";
import {
    controller,
    httpGet,
    httpPost,
    httpPut,
    httpDelete,
} from "inversify-express-utils";
import { MessageService } from "../../services/chat/message.service";
import { inject } from "inversify";

@controller("/message")
export class MessageController {
    private readonly messageService: MessageService;
    constructor(@inject(MessageService) messageService: MessageService) {
        this.messageService = messageService;
    }

    @httpPost("/")
    public async createMessage(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const message = await this.messageService.createMessage(
                request.body,
            );
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
}
