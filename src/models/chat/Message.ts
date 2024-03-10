import mongoose, { Document, Model, Schema } from "mongoose";

export interface Message {
    chatId: string;
    text: string;
    senderId: string;
    recipientId: string;
}

const messageSchema = new Schema(
    {
        chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
        text: { type: String, required: true },
        senderId: { type: Schema.Types.ObjectId, ref: "User", required: true},
        recipientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true },
);

messageSchema.index({
    chatId: 1,
    text: 1,
    sender: 1,
    recipient: 1,
});

export const MessageModel = mongoose.model("Message", messageSchema);
