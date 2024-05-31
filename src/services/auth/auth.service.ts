import { TokenService } from "../token/token.service";
import { Logger } from "@utils/logger";
import { BaseService } from "../base/base.service";
import * as bcrypt from "bcrypt";
import { inject, injectable } from "inversify";
import { ITokens } from "@interfaces/ITokens";
import { BadRequestException } from "@exceptions/bad-request.exception";
import { InternalServerErrorException } from "@exceptions/internal-server-error.exception";
import { UserService } from "@services/user/user.service";
import { IUser } from "@ts/interfaces/IUser";

@injectable()
export class AuthService extends BaseService {
    private readonly tokenService: TokenService;
    private readonly userService: UserService;

    public constructor(
        @inject(TokenService) tokenService: TokenService,
        @inject(Logger) logger: Logger,
        @inject(UserService) userService: UserService,
    ) {
        super(logger);
        this.tokenService = tokenService;
        this.userService = userService;
    }

    public async register(
        type: string,
        name: string,
        surname: string,
        email: string,
        password: string,
    ) {
        if (await this.doesUserExist(email)) {
            this.logger.logError(`User already exists with email: ${email}`);
            throw new BadRequestException("User already exists");
        }
        const hashedPassword: string = await this.hashPassword(password);

        const user = await this.userService.addUser({
            type,
            name,
            surname,
            email,
            password: hashedPassword,
        });
        return this.formUserLoginResponse(user, `User registered: ${email}`);
    }

    public async login(email: string, password: string) {
        const user = await this.userService.getUserByEmail(email);

        if (user) {
            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                return this.formUserLoginResponse(user, `User logged in: ${email}`);
            }
            this.logger.logError(`Incorrect password for ${email}`);
            throw new BadRequestException("Incorrect password");
        }
        this.logger.logError(`User not found with email: ${email}`);
        throw new BadRequestException("User not found");
    }

    public async logout(refreshToken: string) {
        this.logger.logInfo(`User logged out`);
        return await this.tokenService.removeToken(refreshToken);
    }

    public async refresh(refreshToken: string) {
        if (!refreshToken) {
            this.logger.logError("There is no refresh token");
            throw new BadRequestException("There is no refresh token");
        }
        const userData = this.tokenService.validateRefreshToken(refreshToken);

        const tokenFromDb = await this.tokenService.findToken(refreshToken);

        if (!userData || !tokenFromDb) {
            this.logger.logError("Refresh token is invalid");
            throw new BadRequestException("Refresh token is invalid");
        }
        const user = await this.userService.getUserById(userData.id);
        if (!user) {
            this.logger.logError("User not found");
            throw new BadRequestException("User not found");
        }

        return this.formUserLoginResponse(user);
    }

    private async doesUserExist(email: string) {
        const existingUser = await this.userService.getUserByEmail(email);
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

    private async formUserLoginResponse(user: IUser, logMessage?: string) {
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
            throw new InternalServerErrorException();
        }
    }
}
