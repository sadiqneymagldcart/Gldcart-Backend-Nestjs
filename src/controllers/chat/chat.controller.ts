import * as express from "express";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import { ChatService } from "@services/chat/chat.service";

@controller("/chat")
export class ChatController {
    private readonly _chatService: ChatService;
    public constructor(@inject(ChatService) chatService: ChatService) {
        this._chatService = chatService;
    }

    @httpGet("/")
    public async getChats(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const userId = request.query.userId as string;
            const chats = await this._chatService.getChats(userId);
            response.json(chats);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/:senderId/:receiverId")
    public async getChatForUsers(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const sender = req.params.senderId;
            const receiver = req.params.receiverId;
            console.log(sender, receiver);
            const chat = await this._chatService.checkChatForUsers([sender, receiver]);
            if (!chat) {
                res.status(404).json({ message: "Chat not found" });
                return;
            }
            res.status(200).json(chat);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/delete")
    public async deleteAllChats(
        res: express.Response,
        next: express.NextFunction,
    ) {
        try {
            await this._chatService.deleteAllChats();
            res.status(204).send();
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
            const chat = await this._chatService.createChat(participants);
            res.status(201).json(chat);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/:chatId")
    public async getChatById(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const chatId = req.params.chatId;
            const chat = await this._chatService.getChatById(chatId);
            res.json(chat);
        } catch (error) {
            next(error);
        }
    }
}
