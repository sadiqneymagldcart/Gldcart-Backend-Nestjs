import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document {
    chatId: Schema.Types.ObjectId;
    text: string;
    senderId: Schema.Types.ObjectId;
    recipientId: Schema.Types.ObjectId;
}

const messageSchema = new Schema<Message>(
    {
        chatId: { type: Schema.Types.ObjectId, ref: "Chat" },
        text: { type: String, required: true },
        senderId: { type: Schema.Types.ObjectId, ref: "User" },
        recipientId: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true },
);

messageSchema.index({
    chatId: 1,
    text: 1,
    sender: 1,
    recipient: 1,
});

export const MessageModel = mongoose.model(
    "Message",
    messageSchema,
);
