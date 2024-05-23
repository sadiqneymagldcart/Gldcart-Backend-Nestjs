import * as emoji from "node-emoji";
import { StatusCodes } from "http-status-codes";

import { ApiException } from "./api.exception";

class BadRequestException extends ApiException {
    public constructor(message: string) {
        super(
            StatusCodes.BAD_REQUEST,
            "bad_request",
            `${emoji.get("-1")} ${message}.`,
        );
    }
}

export { BadRequestException };
