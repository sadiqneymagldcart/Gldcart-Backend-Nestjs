import { IAddress } from "@ts/interfaces/IAddress";
import { Schema } from "mongoose";

export const AddressSchema = new Schema<IAddress>({
    recipients_name: {
        type: String,
        required: true,
    },
    street_address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
        required: true,
    },
    ZIP_code: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
});
