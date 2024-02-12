import { BaseService } from "../base.service";
import { Logger } from "../../utils/logger";
import {User, UserModel} from "../../models/user/User";

export class UserService extends BaseService {
    public constructor(logger: Logger) {
        super(logger);
    }

    public async findAndUpdateUser(
        type: string,
        name: string,
        surname: string,
        email: string,
        picture: string,
        password: string,
    ): Promise<User> {
        const existingUser = <User>await UserModel.findOne({ email: email });

        if (existingUser) return existingUser;

        const firstName = name.split(" ")[0];

        const newUser = <User>await UserModel.create({
            type: type,
            name: firstName,
            surname: surname,
            email: email,
            profile_picture: picture,
            password: password,
        });
        this.logger.logInfo(`New user created with email: ${email}`);
        return newUser;
    }
}
