import * as express from "express";
import { setRefreshTokenCookie } from "@utils/token.utils";
import { AuthService } from "@services/auth/auth.service";
import {
  Controller,
  controller,
  httpGet,
  httpPost,
} from "inversify-express-utils";
import { inject } from "inversify";

@controller("/auth")
export class AuthController implements Controller {
  private readonly authService: AuthService;

  public constructor(@inject(AuthService) authService: AuthService) {
    this.authService = authService;
  }

  @httpPost("/signup")
  async registerUser(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) {
    const { type, name, surname, email, password } = request.body;

    try {
      const userData = await this.authService.register(
        type,
        name,
        surname,
        email,
        password,
      );
      setRefreshTokenCookie(response, userData.refreshToken);
      return userData;
    } catch (error) {
      next(error);
    }
  }

  @httpPost("/login")
  public async loginUser(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) {
    const { email, password } = request.body;
    try {
      const userData = await this.authService.login(email, password);
      setRefreshTokenCookie(response, userData.refreshToken);
      return userData;
    } catch (error) {
      return next(error);
    }
  }

  @httpPost("/logout")
  public async logoutUser(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) {
    const refreshToken = request.cookies.refreshToken;
    try {
      const token = await this.authService.logout(refreshToken);
      response.clearCookie("refreshToken");
      return token;
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
      const userData = await this.authService.refresh(refreshToken);
      setRefreshTokenCookie(response, userData.refreshToken);
      return userData;
    } catch (error) {
      next(error);
    }
  }
}
