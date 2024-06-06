import * as express from "express";
import { setRefreshTokenCookie } from "@utils/token.utils";
import { AuthService } from "@services/auth/auth.service";
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
} from "inversify-express-utils";
import { inject } from "inversify";

@controller("/auth")
export class AuthController extends BaseHttpController {
  private readonly authService: AuthService;

  public constructor(@inject(AuthService) authService: AuthService) {
    super();
    this.authService = authService;
  }

  @httpPost("/signup")
  async registerUser(request: express.Request, response: express.Response) {
    const { type, name, surname, email, password } = request.body;

    const user = await this.authService.register(
      type,
      name,
      surname,
      email,
      password,
    );
    setRefreshTokenCookie(response, user.refreshToken);
    return this.json(user);
  }

  @httpPost("/login")
  public async loginUser(request: express.Request, response: express.Response) {
    const { email, password } = request.body;
    const user = await this.authService.login(email, password);
    setRefreshTokenCookie(response, user.refreshToken);
    return this.json(user);
  }

  @httpPost("/logout")
  public async logoutUser(
    request: express.Request,
    response: express.Response,
  ) {
    const refreshToken = request.cookies.refreshToken;
    const token = await this.authService.logout(refreshToken);
    response.clearCookie("refreshToken");
    return this.json(token);
  }

  @httpGet("/refresh")
  public async refresh(request: express.Request, response: express.Response) {
    const refreshToken = request.cookies.refreshToken as string;
    const user = await this.authService.refresh(refreshToken);
    setRefreshTokenCookie(response, user.refreshToken);
    return this.json(user);
  }
}
