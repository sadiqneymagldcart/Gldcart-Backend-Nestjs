import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document {
    chatId: Schema.Types.ObjectId | string;
    text?: string;
    file?: any;
    senderId: Schema.Types.ObjectId | string;
    recipientId: Schema.Types.ObjectId | string;
}

const messageSchema = new Schema<Message>(
    {
        chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
        text: { type: String },
        file: { type: Schema.Types.Mixed },
        senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        recipientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
