import { Socket } from "socket.io";
import { ChatModel } from "./models/chat/Chat";
import { Message, MessageModel } from "./models/chat/Message";

export async function createSocket(io: any) {
    io.on("connection", (socket: Socket) => {
        socket.on("join", async (chatId: string) => {
            try {
                let chat = await ChatModel.findById(chatId);
                if (!chat) {
                    throw new Error("Chat not found");
                }
                socket.join(chatId);
                socket.emit("joined", chat);
            } catch (error) {
                console.log(error);
            }
        });
        socket.on("message", async (message: Message) => {
            try {
                let chat = await ChatModel.findById(message.chatId);

                if (!chat) {
                    throw new Error("Chat not found");
                }
                await MessageModel.create(message);
                io.to(message.chatId).emit("message", message);
            } catch (error) {
                console.log(error);
            }
        });
        socket.on("leave", (chatId: string) => {
            socket.leave(chatId);
        });
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    });
}
