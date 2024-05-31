import * as express from "express";
import { UnauthorizedException } from "@exceptions/unauthorized.exception";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { TokenService } from "@services/token/token.service";

@injectable()
export class AuthenticationMiddleware extends BaseMiddleware {
    private readonly tokenService: TokenService;

    public constructor(@inject(TokenService) tokenService: TokenService) {
        super();
        this.tokenService = tokenService;
    }

    public handler(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ): void {
        const authorizationHeader = request.headers.authorization as string;

        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
            return next(new UnauthorizedException());
        }

        const accessToken = this.getAccessTokenFromHeader(authorizationHeader);

        const userData = this.tokenService.validateAccessToken(accessToken);

        if (!userData) {
            return next(new UnauthorizedException());
        }
        response.locals.user = userData;
        next();
    }

    private getAccessTokenFromHeader(
        authorizationHeader: string,
    ): string {
        return (authorizationHeader.split(" "))[1];
    }
}
