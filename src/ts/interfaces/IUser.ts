import { IAddress } from "./IAddress";
import { Document } from "mongoose";

interface IUser extends Document {
    type: string;
    name: string;
    surname: string;
    email: string;
    addresses: IAddress[];
    profile_picture: string;
    password: string;
    wishlist: string[];
    passwordResetToken?: string;
    activeSubscription: string | null;
    BIO?: string;
    phone_number?: string;
    status?: string;
    address?: string;
    document_images?: string[];
    verification_token?: string;
    confirmed?: boolean;
    verified?: boolean;
    is_online?: boolean;
}

export { IUser }
