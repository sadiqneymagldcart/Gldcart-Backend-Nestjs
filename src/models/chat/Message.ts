import { IMessage } from "@ts/interfaces/IMessage";
import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema<IMessage>(
    {
        chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
        text: { type: String },
        files: { type: Schema.Types.Mixed },
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
) as mongoose.Model<IMessage>;
