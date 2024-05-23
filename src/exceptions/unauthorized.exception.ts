import * as emoji from "node-emoji";
import { StatusCodes } from "http-status-codes";
import { ApiException } from "./api.exception";

class UnauthorizedException extends ApiException {
    public constructor() {
        super(
            StatusCodes.UNAUTHORIZED,
            "unauthorized",
            `${emoji.get("ticket")} Failed to authenticate.`,
        );
    }
}

export { UnauthorizedException };
