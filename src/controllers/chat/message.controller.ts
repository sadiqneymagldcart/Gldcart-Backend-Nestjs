import * as express from "express";
import { MessageService } from "@services/chat/message.service";
import { inject } from "inversify";
import {
    BaseHttpController,
    controller,
    httpGet,
    httpPost,
    httpPut,
} from "inversify-express-utils";
import { AuthenticationMiddleware } from "@middlewares/authentication.middleware";

@controller("/message", AuthenticationMiddleware)
export class MessageController extends BaseHttpController {
    private readonly messageService: MessageService;

    public constructor(@inject(MessageService) messageService: MessageService) {
        super();
        this.messageService = messageService;
    }

    @httpGet("/search")
    public async searchMessages(request: express.Request) {
        const query = request.query.query as string;
        const userId = request.query.userId as string;
        const messages = await this.messageService.searchMessages(query, userId);
        return this.json(messages);
    }

    @httpPost("/")
    public async createMessage(request: express.Request) {
        const message = await this.messageService.createMessage(request.body);
        return this.json(message, 201);
    }

    @httpGet("/:chatId")
    public async getMessages(request: express.Request) {
        const chatId = request.params.chatId;
        const messages = await this.messageService.getMessages(chatId);
        return this.json(messages);
    }

    @httpPut("/:messageId")
    public async updateMessage(request: express.Request) {
        const messageId = request.params.messageId;
        const message = await this.messageService.updateMessage(
            messageId,
            request.body,
        );
        return this.json(message);
    }
}
