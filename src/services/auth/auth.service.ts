import { TokenService } from "../token/token.service";
import { Logger } from "@utils/logger";
import { BaseService } from "../base/base.service";
import { ApiError } from "@exceptions/api.error";
import { Token } from "@models/token/Token";
import * as bcrypt from "bcrypt";
import { User, UserModel } from "@models/user/User";
import { inject, injectable } from "inversify";
import {ITokens} from "@interfaces/ITokens";

@injectable()
export class AuthService extends BaseService {
    private readonly tokenService: TokenService;

    public constructor(
        @inject(TokenService) tokenService: TokenService,
        @inject(Logger) logger: Logger,
    ) {
        super(logger);
        this.tokenService = tokenService;
    }

    public async register(
        type: string,
        name: string,
        surname: string,
        email: string,
        password: string,
    ) {
        if (await this.doesUserExist(email)) {
            throw ApiError.BadRequest("That contact is already registered");
        }
        const hashedPassword: string = await this.hashPassword(password);
        const user: User = <User>await UserModel.create({
            type,
            name,
            surname,
            email,
            password: hashedPassword,
        });
        return this.formUserLoginResponse(user, `User registered: ${email}`);
    }

    public async login(email: string, password: string) {
        const user: User = <User>await UserModel.findOne({ email });
        if (user) {
            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                return this.formUserLoginResponse(user, `User logged in: ${email}`);
            }
            this.logger.logError(`Incorrect password for ${email}`);
            throw ApiError.BadRequest("Incorrect password");
        }
        this.logger.logError(`User not found with email: ${email}`);
        throw ApiError.BadRequest("Incorrect contact");
    }

    public async logout(refreshToken: string) {
        this.logger.logInfo(`User logged out`);
        return await this.tokenService.removeToken(refreshToken);
    }

    public async refresh(refreshToken: string) {
        if (!refreshToken) {
            this.logger.logError("There is no refresh token");
            throw ApiError.UnauthorizedError();
        }
        const userData = this.tokenService.validateRefreshToken(refreshToken);

        const tokenFromDb: Token | null =
            await this.tokenService.findToken(refreshToken);

        if (!userData || !tokenFromDb) {
            this.logger.logError("Refresh token is invalid");
            throw ApiError.UnauthorizedError();
        }
        const user = <User>await UserModel.findById(userData.id);

        return this.formUserLoginResponse(user);
    }

    private async doesUserExist(email: string) {
        const existingUser = await UserModel.findOne({ email });
        return Boolean(existingUser);
    }

    private async hashPassword(password: string) {
        try {
            const salt: string = await bcrypt.genSalt();
            return await bcrypt.hash(password, salt);
        } catch (error) {
            throw error;
        }
    }

    private async formUserLoginResponse(user: User, logMessage?: string) {
        try {
            const userObj = {
                id: user._id,
                type: user.type,
                name: user.name,
                surname: user.surname,
                email: user.email,
            };

            const tokens: ITokens = this.tokenService.createTokens({ ...userObj });
            await this.tokenService.saveToken(userObj.id, tokens.refreshToken);
            if (logMessage) {
                this.logger.logInfo(logMessage);
            }
            return { ...tokens, user: userObj };
        } catch (error: any) {
            this.logger.logError(error.message, error);
            throw ApiError.InternalServerError(error.message);
        }
    }
}
