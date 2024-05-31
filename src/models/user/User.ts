import mongoose, { Model, Schema } from "mongoose";
import validator from "validator";
import { AddressSchema } from "../personal/Address";
import { IUser } from "@ts/interfaces/IUser";

const userSchema = new Schema<IUser>({
    type: {
        type: String,
        required: [true, "Client's type is undefined"],
    },

    name: {
        type: String,
        required: [true, "Please, enter your first name"],
    },

    surname: {
        type: String,
    },

    email: {
        type: String,
        required: [true, "Please, enter an contact"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please, enter a valid contact"],
    },

    addresses: [AddressSchema],

    profile_picture: {
        type: String,
    },

    password: {
        type: String,
        required: [true, "Please, enter a password"],
        minlength: [6, "Minimum password length is 6 characters"],
    },

    wishlist: {
        type: [String],
    },

    passwordResetToken: {
        type: String,
    },

    activeSubscription: {
        type: String,
        ref: "Subscription",
        default: null,
    },

    BIO: {
        type: String,
    },

    phone_number: {
        type: String,
    },

    status: {
        type: String,
    },

    address: {
        type: String,
    },

    document_images: {
        type: [String],
    },

    verification_token: {
        type: String,
    },

    confirmed: {
        type: Boolean,
        default: false,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    is_online: {
        type: Boolean,
        default: false,
    },
});

export const UserModel = mongoose.model("User", userSchema) as Model<IUser>;
