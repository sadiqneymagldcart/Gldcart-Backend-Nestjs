export class ApiError extends Error {
    status: number;
    errors: any[];

    public constructor(status: number, message: string, errors: any[] = []) {
        super(message);
        this.status = status;
        this.errors = errors;
        Object.setPrototypeOf(this, new.target.prototype);
    }

    public static UnauthorizedError(): ApiError {
        return new ApiError(401, 'User is not authorized');
    }

    public static BadRequest(message: string, errors: any[] = []): ApiError {
        return new ApiError(400, message, errors);
    }

    public static InternalServerError(message: string): ApiError {
        return new ApiError(500, message);
    }

}
