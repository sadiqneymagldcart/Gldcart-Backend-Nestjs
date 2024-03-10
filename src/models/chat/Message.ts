import mongoose, { Document, Model, Schema } from "mongoose";

export interface Message extends Document {
    chatId: string;
    text: string;
    sender: string;
    recipient: string;
}

const messageSchema = new Schema(
    {
        chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
        text: { type: String, required: true },
        sender: { type: String, required: true },
        recipient: { type: String, required: true },
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
