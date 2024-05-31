import { Document } from "mongoose";

interface IChat extends Document {
    participants: string[];
}

export { IChat };
