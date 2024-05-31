import * as express from "express";
import {
    Controller,
    controller,
    httpGet,
    httpPost,
} from "inversify-express-utils";
import { inject } from "inversify";
import { ChatService } from "@services/chat/chat.service";
import { AuthenticationMiddleware } from "@middlewares/authentication.middleware";

@controller("/chat", AuthenticationMiddleware)
export class ChatController implements Controller {
    private readonly chatService: ChatService;

    public constructor(@inject(ChatService) chatService: ChatService) {
        this.chatService = chatService;
    }

    @httpGet("/")
    public async getChats(request: express.Request, next: express.NextFunction) {
        const userId = request.query.userId as string;
        try {
            return await this.chatService.getChats(userId);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/:senderId/:receiverId")
    public async getChatForUsers(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        const sender = request.params.senderId;
        const receiver = request.params.receiverId;
        try {
            const chat = await this.chatService.checkChatForUsers([sender, receiver]);
            if (!chat) {
                response.status(404).json({ message: "Chat not found" });
                return;
            }
            return chat;
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/delete")
    public async deleteAllChats(
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            await this.chatService.deleteAllChats();
            response.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    @httpPost("/")
    public async createChat(
        request: express.Request,
        next: express.NextFunction,
    ) {
        const participants = request.body.participants as string[];
        try {
            return await this.chatService.createChat(participants);
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/:chatId")
    public async getChatById(
        request: express.Request,
        next: express.NextFunction,
    ) {
        const chatId = request.params.chatId;
        try {
            return await this.chatService.getChatById(chatId);
        } catch (error) {
            next(error);
        }
    }
}
