import * as express from 'express';
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { ChatModel } from '../../models/chat/Chat';
import { MessageModel } from '../../models/chat/Message';

@controller('/chat')
export class ChatController {
    @httpGet('/')
    public async getChats(req: express.Request, res: express.Response) {
        try {
            const userId = req.query.userId;
            // const chats = await ChatModel.find({ participants: userId }).populate("participants").populate("messages");
            const chats = await ChatModel.find({ participants: userId });
            res.status(200).json(chats);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    @httpPost('/')
    public async createChat(req: express.Request, res: express.Response) {
        try {
            const { participants } = req.body;
            const newChat = new ChatModel({ participants });
            await newChat.save();
            res.status(200).json(newChat);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    @httpPost('/message')
    public async sendMessage(req: express.Request, res: express.Response) {
        try {
            const { chatId, text, sender, recipient } = req.body;
            const newMessage = new MessageModel({ chatId, text, sender, recipient });
            await newMessage.save();
            res.status(200).json(newMessage);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
