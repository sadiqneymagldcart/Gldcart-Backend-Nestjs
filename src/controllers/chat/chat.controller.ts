import * as express from "express";
import {
    BaseHttpController,
    controller,
    httpGet,
    httpPost,
} from "inversify-express-utils";
import { inject } from "inversify";
import { ChatService } from "@services/chat/chat.service";
import { AuthenticationMiddleware } from "@middlewares/authentication.middleware";

@controller("/chat", AuthenticationMiddleware)
export class ChatController extends BaseHttpController {
    private readonly chatService: ChatService;

    public constructor(@inject(ChatService) chatService: ChatService) {
        super();
        this.chatService = chatService;
    }

    @httpGet("/")
    public async getChats(request: express.Request) {
        const userId = request.query.userId as string;
        console.log(userId);
        const chats = await this.chatService.getChats(userId);
        console.log(chats);
        return this.ok(chats);
    }

    @httpGet("/:senderId/:receiverId")
    public async getChatForUsers(request: express.Request) {
        const sender = request.params.senderId;
        const receiver = request.params.receiverId;
        return await this.chatService.checkChatForUsers([sender, receiver]);
        // return this.json(chat);
    }

    @httpGet("/delete")
    public async deleteAllChats() {
        await this.chatService.deleteAllChats();
        return this.statusCode(204);
    }

    @httpPost("/")
    public async createChat(request: express.Request) {
        const participants = request.body.participants as string[];
        const chat = await this.chatService.createChat(participants);
        return this.json(chat, 201);
    }

    @httpGet("/:chatId")
    public async getChatById(request: express.Request) {
        const chatId = request.params.chatId;
        const chat = await this.chatService.getChatById(chatId);
        console.log(chat);
        return this.ok(chat);
    }
}
