import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document {
    chatId: Schema.Types.ObjectId | string;
    text: string;
    senderId: Schema.Types.ObjectId | string;
    recipientId: Schema.Types.ObjectId | string;
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
    text: 1,
    senderId: 1,
    recipientId: 1,
});

export const MessageModel = mongoose.model(
    "Message",
    messageSchema,
) as mongoose.Model<Message>;
