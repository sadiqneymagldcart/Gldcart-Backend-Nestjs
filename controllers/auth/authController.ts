import { NextFunction, Request, Response } from "express";
import { setRefreshTokenCookie } from "../../utils/tokenUtils";
import { AuthService } from "../../services/auth/authService";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import "reflect-metadata";

@controller('/auth')
export class AuthController {
    private _authService: AuthService;

    constructor(@inject(AuthService) authService: AuthService) {
        this._authService = authService;
    }

    @httpPost('/signup')
    async registrationHandler(
        request: Request,
        response: Response,
        next: NextFunction,
    ): Promise<void> {
        const { type, name, surname, email, password } = request.body;

        try {
            const userData = await this._authService.register(
                type,
                name,
                surname,
                email,
                password,
            );
            setRefreshTokenCookie(response, userData.refreshToken);
            response.status(201).json(userData);
        } catch (error) {
            next(error);
        }
    }
    @httpPost('/login')
    async loginHandler(
        request: Request,
        response: Response,
        next: NextFunction,
    ): Promise<void> {
        const { email, password } = request.body;
        console.log(email, password);
        try {
            const userData = await this._authService.login(email, password);
            console.log(userData.accessToken);
            setRefreshTokenCookie(response, userData.refreshToken);
            response.status(201).json(userData);
        } catch (error) {
            next(error);
        }
    }

    @httpPost('/logout')
    async logoutHandler(
        request: Request,
        response: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const refreshToken = request.cookies.refreshToken;
            const token = await this._authService.logout(refreshToken);
            response.clearCookie("refreshToken");
            response.json(token);
        } catch (e) {
            next(e);
        }
    }

    @httpGet('/refresh')
    async refreshHandler(
        request: Request,
        response: Response,
        next: NextFunction,
    ) {
        try {
            const refreshToken = request.cookies.refreshToken as string;
            const userData = await this._authService.refresh(refreshToken);
            setRefreshTokenCookie(response, userData.refreshToken);
            return response.json(userData);
        } catch (error) {
            next(error);
        }
    }
}
