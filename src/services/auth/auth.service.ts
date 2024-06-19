import { TokenService } from "@services/token/token.service";
import { Logger } from "@utils/logger";
import { BaseService } from "../base/base.service";
import * as bcrypt from "bcrypt";
import { inject, injectable } from "inversify";
import { BadRequestException } from "@exceptions/bad-request.exception";
import { InternalServerErrorException } from "@exceptions/internal-server-error.exception";
import { UserService } from "@services/user/user.service";
import { ITokenPayload } from "@src/ts/interfaces/ITokenPayload";
import { ILoginDto } from "@src/controllers/auth/auth.controller";
import { LoginRequestDto } from "@src/dto/login.request.dto";

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

    public async register(registrationData: LoginRequestDto) {
        if (await this.doesUserExist(registrationData.email)) {
            this.logger.logError(
                `User already exists with email: ${registrationData.email}`,
            );
            throw new BadRequestException("User already exists");
        }

        const hashPassword = await bcrypt.hash(registrationData.password, 5);
        const user = await this.userService.addUser({
            ...registrationData,
            password: hashPassword,
        });
        return this.formUserLoginResponse(user);
    }

    public async login(email: string, password: string) {
        const user = await this.userService.getUserByEmail(email);

        if (user) {
            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                return this.formUserLoginResponse(user);
            }
            this.logger.logError(`Incorrect password for ${email}`);
            throw new BadRequestException("Incorrect password");
        }
        this.logger.logError(`User not found with email: ${email}`);
        throw new BadRequestException("User not found");
    }

    public async logout(refreshToken: string) {
        this.logger.logInfo(`User logged out`);
        await this.tokenService.removeToken(refreshToken);
    }

    public async refresh(refreshToken: string) {
        if (!refreshToken) {
            this.logger.logError("There is no refresh token");
            throw new BadRequestException("There is no refresh token");
        }
        const user = await this.tokenService.validateRefreshToken(refreshToken);

        if (!user) {
            this.logger.logError("Refresh token is invalid");
            throw new BadRequestException("Refresh token is invalid");
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

    private async formUserLoginResponse(user: LoginRequestDto) {
        try {
            const tokens = this.tokenService.createTokens({ ...user });
            await this.tokenService.saveRefreshToken(user.id, tokens.refreshToken);
            return { ...tokens, user: user };
        } catch (error: any) {
            this.logger.logError(error.message, error);
            throw new InternalServerErrorException();
        }
    }
}
