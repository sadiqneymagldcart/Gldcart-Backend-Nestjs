import { BaseService } from "../base/base.service";
import { TokenService } from "../token/token.service";
import { Logger } from "@utils/logger";
import { ApiException } from "@exceptions/api.exception";
import axios, { AxiosResponse } from "axios";
import qs from "qs";
import { inject, injectable } from "inversify";
import { IAuthValues } from "@interfaces/IAuthValues";
import { IGoogleUserInfo } from "@interfaces/IGoogleUserInfo";
import { IGoogleTokenResult } from "@interfaces/IGoogleTokenResult";
import { IGoogleUserResult } from "@interfaces/IGoogleUserResult";
import { Nullable } from "@ts/types/nullable";
import { UserService } from "@services/user/user.service";
import { IUser } from "@models/user/User";

@injectable()
export class GoogleAuthService extends BaseService {
  private readonly tokenService: TokenService;
  private readonly userService: UserService;

  public constructor(
    @inject(Logger) logger: Logger,
    @inject(UserService) userService: UserService,
    @inject(TokenService) tokenService: TokenService,
  ) {
    super(logger);
    this.tokenService = tokenService;
    this.userService = userService;
  }

  public async loginGoogleUser(userInfo: IGoogleUserInfo) {
    const user = await this.updateOrCreateGoogleUser(userInfo);
    return this.authenticateWithGoogle(user, userInfo.picture);
  }

  public async getGoogleOAuthTokens({
    code,
  }: {
    code: string;
  }): Promise<Nullable<IGoogleTokenResult>> {
    const values = this.getOAuthValues(code);
    try {
      const googleResponse = await this.postToUrl(
        process.env.GOOGLE_TOKEN_URL as string,
        values,
      );
      return googleResponse.data;
    } catch (error: any) {
      await this.handleTokenError(error);
    }
  }

  public async getGoogleUser(
    id_token: string,
    access_token: string,
  ): Promise<Nullable<IGoogleUserResult>> {
    try {
      const res = await this.getGoogleUserInfo(id_token, access_token);
      return res.data;
    } catch (error: any) {
      await this.handleUserInfoError(error);
    }
  }

  private async updateOrCreateGoogleUser(googleUserData: IGoogleUserInfo) {
    let existingUser = await this.userService.getUserByEmail(
      googleUserData.email,
    );

    if (!existingUser)
      existingUser = await this.createGoogleUser(googleUserData);

    return existingUser;
  }

  private async createGoogleUser(googleUserData: IGoogleUserInfo) {
    const firstName = googleUserData.name.split(" ")[0];

    const newUser = await this.userService.addUser({
      type: googleUserData.type,
      name: firstName,
      surname: googleUserData.surname,
      email: googleUserData.email,
      profile_picture: googleUserData.picture,
      password: googleUserData.password,
    });
    this.logger.logInfo(`New user created with email: ${googleUserData.email}`);
    return newUser;
  }

  private async authenticateWithGoogle(user: IUser, picture: string) {
    const userInfo = {
      id: user._id,
      type: user.type,
      name: user.name,
      surname: user.surname,
      email: user.email,
    };

    try {
      const tokens = await this.tokenService.createAndSaveTokens(userInfo);
      this.logger.logInfo(`User logged in with Google: ${user.email}`);
      return { tokens, user: userInfo, picture: picture };
    } catch (error: any) {
      this.logger.logError("Failed to create tokens", error);
      throw new ApiException(403, "Failed to create tokens", error);
    }
  }

  private getOAuthValues(code: string): IAuthValues {
    return {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: "authorization_code",
    };
  }

  private async handleTokenError(error: any): Promise<void> {
    this.logger.logError(
      "Failed to fetch Google OAuth Tokens",
      error.response?.data,
    );
    throw new ApiException(403, "Failed to fetch Google OAuth Tokens", error);
  }

  private async postToUrl(
    url: string,
    values: IAuthValues,
  ): Promise<AxiosResponse<IGoogleTokenResult>> {
    return await axios.post<IGoogleTokenResult>(url, qs.stringify(values), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  }

  private async getGoogleUserInfo(id_token: string, access_token: string) {
    return await axios.get<IGoogleUserResult>(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: { Authorization: `Bearer ${id_token}` },
      },
    );
  }

  private async handleUserInfoError(error: any) {
    this.logger.logError("Failed to fetch Google User", error.message);
    throw new Error(error.message);
  }
}
