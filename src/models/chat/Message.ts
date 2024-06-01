import mongoose, { Schema } from "mongoose";

interface IMessage extends Document {
    chatId: Schema.Types.ObjectId | string;
    text?: string;
    files?: any;
    senderId: Schema.Types.ObjectId | string;
    recipientId: Schema.Types.ObjectId | string;
}

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

const MessageModel = mongoose.model(
    "Message",
    messageSchema,
) as mongoose.Model<IMessage>;

export { IMessage, MessageModel };
