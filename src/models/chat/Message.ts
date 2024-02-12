import { Schema } from "mongoose";

export interface Message extends Document {
        chatId: string;
        senderId: string;
        text: string;
        createdAt: Date;
        updatedAt: Date;
        readAt: Date;
        deletedAt: Date;
}

export const MessageSchema = new Schema<Message>({
        chatId: {
                type: String,
                required: true,
        },
        senderId: {
                type: String,
                required: true,
        },
        text: {
                type: String,
                required: true,
        },
        createdAt: {
                type: Date,
                required: true,
        },
        updatedAt: {
                type: Date,
                required: true,
        },
        readAt: {
                type: Date,
                required: false,
        },
        deletedAt: {
                type: Date,
                required: false,
        },
});
