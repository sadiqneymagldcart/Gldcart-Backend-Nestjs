import { Socket } from "socket.io";
import { ChatModel } from "./models/chat/Chat";
import { Message, MessageModel } from "./models/chat/Message";
import { AwsStorage } from "./storages/aws.storage";

export async function createSocket(io: any, awsStorage: AwsStorage) {
    io.on("connection", (socket: Socket) => {
        socket.on("join", async (chatId: string) => {
            try {
                const chat = await ChatModel.findById(chatId);
                if (!chat) {
                    throw new Error("Chat not found");
                }
                socket.join(chatId);
                io.to(chatId).emit("joined", chatId);
            } catch (error) {
                socket.emit("error", { message: error.message });
            }
        });

        socket.on("message", async (data: any) => {
            try {
                let message: Message;
                if (data.text) {
                    message = data;
                } else {
                    throw new Error("Invalid message data");
                }
                const chat = await ChatModel.findById(message.chatId);
                if (!chat) {
                    throw new Error("Chat not found");
                }
                const savedMessage = await MessageModel.create(message);
                io.to(message.chatId).emit("message", savedMessage);
            } catch (error) {
                socket.emit("error", { message: error.message });
            }
        });

        socket.on("file", async (data: any) => {
            try {
                const urls = await awsStorage.upload([data.file]);
                const message: Message = {
                    chatId: data.chatId,
                    senderId: data.senderId,
                    text: `${urls[0]}`, 
                    recipientId: data.recipientId,
                };
                const chat = await ChatModel.findById(message.chatId);
                if (!chat) {
                    throw new Error("Chat not found");
                }
                const savedMessage = await MessageModel.create(message);
                io.to(message.chatId).emit("message", savedMessage);
            } catch (error) {
                socket.emit("error", { message: error.message });
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

