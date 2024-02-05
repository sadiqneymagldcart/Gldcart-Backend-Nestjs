import mongoose, {Document, Model, Schema} from "mongoose";
import validator from "validator";
import {AddressSchema, IAddress} from "./Address";

export interface User extends Document {
    type: string;
    name: string;
    surname: string;
    email: string;
    addresses: IAddress[];
    picture: string;
    password: string;
    passwordResetToken?: string;
    activeSubscription: string | null;
    BIO?: string;
    phone_number?: string;
    address?: string;
}

const userSchema = new Schema<User>({
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
    picture: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "Please, enter a password"],
        minlength: [6, "Minimum password length is 6 characters"],
    },
    passwordResetToken: {
        type: String,
    },
    activeSubscription: {
        type: String,
        ref: 'Subscription',
        default: null,
    },
    BIO: {
        type: String,
    },
    phone_number: {
        type: String,
    },
    address: {
        type: String,
    },
});

const UserModel = mongoose.model("User", userSchema) as Model<User>;
export default UserModel;
