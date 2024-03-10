import * as express from "express";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import { ChatService } from "../../services/chat/chat.service";

@controller("/chat")
export class ChatController {
    private readonly chatService: ChatService;
    constructor(@inject(ChatService) chatService: ChatService) {
        this.chatService = chatService;
    }

    @httpGet("/")
    public async getChats(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const userId = req.query.userId as string;
            const chats = await this.chatService.getChats(userId);
            res.json(chats);
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/")
    public async createChat(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const participants = req.body.participants as string[];
            const chat = await this.chatService.createChat(participants);
            res.json(chat);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/:chatId")
    public async getChatMessages(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const chatId = req.params.chatId;
            const messages = await this.chatService.getChatMessages(chatId);
            res.json(messages);
        } catch (error) {
            next(error);
        }
    }
}
