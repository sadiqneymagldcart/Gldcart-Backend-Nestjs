import * as express from "express";
import { setRefreshTokenCookie } from "@utils/token.utils";
import { AuthService } from "@services/auth/auth.service";
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  requestBody,
  response,
} from "inversify-express-utils";
import { inject } from "inversify";
import { LoginRequestDto } from "@src/dto/login.request.dto";

@controller("/auth")
export class AuthController extends BaseHttpController {
  private readonly authService: AuthService;

  public constructor(@inject(AuthService) authService: AuthService) {
    super();
    this.authService = authService;
  }

  @httpPost("/signup")
  async register(
    @requestBody() loginData: LoginRequestDto,
    response: express.Response,
  ) {
    const user = await this.authService.register(loginData);

    setRefreshTokenCookie(response, user.refreshToken);

    return this.json(user);
  }

  // TODO: Create login dto
  @httpPost("/login")
  public async login(
    @response() response: express.Response,
    @requestBody() loginDto: any,
  ) {
    const user = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    setRefreshTokenCookie(response, user.refreshToken);

    return this.json(user);
  }

  @httpPost("/logout")
  public async logout(request: express.Request, response: express.Response) {
    const refreshToken = request.cookies.refreshToken;

    await this.authService.logout(refreshToken);

    response.clearCookie("refreshToken");
  }

  @httpGet("/refresh")
  public async refresh(request: express.Request, response: express.Response) {
    const refreshToken = request.cookies.refreshToken;

    const user = await this.authService.refresh(refreshToken);

    setRefreshTokenCookie(response, user.refreshToken);

    return this.json(user);
  }
}
