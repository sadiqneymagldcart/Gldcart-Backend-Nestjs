import { Schema } from "mongoose";
import { Message, MessageSchema } from "./Message";

export interface Chat extends Document {
        members: string[];
        messages: Message[];
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
}

export const ChatSchema = new Schema<Chat>({
        members: {
                type: [String],
                required: true,
        },
        messages: {
                type: [MessageSchema],
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
        deletedAt: {
                type: Date,
                required: false,
        },
});
