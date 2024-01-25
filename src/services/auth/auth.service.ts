import {TokenService} from "../token/token.service";
import {Logger} from "../../utils/logger";
import {BaseService} from "../base.service";
import {ApiError} from "../../exceptions/api.error";
import {IToken} from "../../models/Token";
import User, {IUser} from "../../models/User";
import bcrypt from "bcrypt";
import {inject, injectable} from "inversify";

@injectable()
export class AuthService extends BaseService {
    private tokenService: TokenService;

    constructor(
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
        const user: IUser = <IUser>await User.create({
            type,
            name,
            surname,
            email,
            password: hashedPassword,
        });
        return this.formUserLoginResponse(user, `User registered: ${email}`);
    }

    public async login(email: string, password: string) {
        const user: IUser = <IUser>await User.findOne({ email });
        if (user) {
            const auth: boolean = await bcrypt.compare(password, user.password);
            if (auth) {
                return this.formUserLoginResponse(user, `User logged in: ${email}`);
            }
            await this.logger.logError(`Incorrect password for ${email}`);
            throw ApiError.BadRequest("Incorrect password");
        }
        await this.logger.logError(`User not found with email: ${email}`);
        throw ApiError.BadRequest("Incorrect contact");
    }

    public async logout(refreshToken: string) {
        await this.logger.logInfo(`User logged out`);
        return await this.tokenService.removeToken(refreshToken);
    }

    public async refresh(refreshToken: string) {
        if (!refreshToken) {
            await this.logger.logError("There is no refresh token");
            throw ApiError.UnauthorizedError();
        }
        const userData = this.tokenService.validateRefreshToken(refreshToken);

        const tokenFromDb: IToken | null =
            await this.tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            await this.logger.logError("Refresh token is invalid");
            throw ApiError.UnauthorizedError();
        }
        const user = <IUser>await User.findById(userData._id);
        return this.formUserLoginResponse(user);
    }

    private async doesUserExist(email: string): Promise<boolean> {
        const existingUser = await User.findOne({ email });
        return Boolean(existingUser);
    }

    private async hashPassword(password: string): Promise<string> {
        try {
            const salt: string = await bcrypt.genSalt();
            return await bcrypt.hash(password, salt);
        } catch (error) {
            throw error;
        }
    }

    private async formUserLoginResponse(user: IUser, logMessage?: string) {
        try {
            const tokens: { accessToken: string; refreshToken: string } =
                this.tokenService.createTokens({...user});
            await this.tokenService.saveToken(user.id, tokens.refreshToken);
            if (logMessage) {
                await this.logger.logInfo(logMessage);
            }
            return { ...tokens, user };
        } catch (error: any) {
            await this.logger.logError(error.message, error);
            throw error;
        }
    }
}
