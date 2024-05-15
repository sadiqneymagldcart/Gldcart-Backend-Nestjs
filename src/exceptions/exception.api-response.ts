import { ApiException } from "./api.exception";

class ExceptionApiResponse {
    public status: number;

    public code: string;

    public message: string;

    public constructor(status: number, code: string, message: string) {
        this.status = status;
        this.code = code;
        this.message = message;
    }

    public static fromApiException(
        exception: ApiException,
    ): ExceptionApiResponse {
        return new ExceptionApiResponse(
            exception.status,
            exception.code.toLowerCase(),
            exception.message,
        );
    }
}

export { ExceptionApiResponse };
