import { Schema } from "mongoose";

interface IMessage extends Document {
    chatId: Schema.Types.ObjectId | string;
    text?: string;
    files?: any;
    senderId: Schema.Types.ObjectId | string;
    recipientId: Schema.Types.ObjectId | string;
}
export { IMessage };

