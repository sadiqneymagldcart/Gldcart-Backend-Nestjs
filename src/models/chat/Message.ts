import mongoose, { Model, Schema } from "mongoose";

export interface Message extends Document {
    chatId: string;
    text: string;
    senderId: string;
    recipientId: string;
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
) as Model<Message>;
