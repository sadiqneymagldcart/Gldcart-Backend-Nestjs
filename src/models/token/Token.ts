import mongoose, { Document, Model, Schema } from "mongoose";

export interface Token extends Document {
    user: Schema.Types.ObjectId;
    refreshToken: string;
}

const tokenSchema = new Schema<Token>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    refreshToken: {
        type: String,
        required: true,
    },
});

const TokenModel = mongoose.model("Token", tokenSchema) as Model<Token>;

export default TokenModel;
