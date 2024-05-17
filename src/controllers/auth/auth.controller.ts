import * as express from "express";
import { setRefreshTokenCookie } from "@utils/token.utils";
import { AuthService } from "@services/auth/auth.service";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { inject } from "inversify";

@controller("/auth")
export class AuthController {
  private readonly _authService: AuthService;

  public constructor(@inject(AuthService) authService: AuthService) {
    this._authService = authService;
  }

  @httpPost("/signup")
  async registerUser(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
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

  @httpPost("/login")
  public async loginUser(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ): Promise<void> {
    const { email, password } = request.body;
    try {
      const userData = await this._authService.login(email, password);
      setRefreshTokenCookie(response, userData.refreshToken);
      response.status(201).json(userData);
    } catch (error) {
      return next(error);
    }
  }

  @httpPost("/logout")
  public async logoutUser(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ): Promise<void> {
    const refreshToken = request.cookies.refreshToken;
    try {
      const token = await this._authService.logout(refreshToken);
      response.clearCookie("refreshToken");
      response.json(token);
    } catch (error) {
      next(error);
    }
  }

  @httpGet("/refresh")
  public async refresh(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) {
    const refreshToken = request.cookies.refreshToken as string;
    try {
      const userData = await this._authService.refresh(refreshToken);
      setRefreshTokenCookie(response, userData.refreshToken);
      response.status(201).json(userData);
    } catch (error) {
      next(error);
    }
  }

  @httpPost("")
  public async() { }
}
