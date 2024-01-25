import {BaseService} from "../base.service";
import {Logger} from "../../utils/logger";
import User, {IUser} from "../../models/User";

export class UserService extends BaseService{

    constructor(logger: Logger) {
        super(logger);
    }

    public async findAndUpdateUser(
        type: string,
        name: string,
        surname: string,
        email: string,
        picture: string,
        password: string
    ): Promise<IUser> {
        const existingUser = <IUser>await User.findOne({email: email});

        if (existingUser)
            return existingUser;

        const firstName = name.split(' ')[0];

        const newUser = <IUser>await User.create({
            type: type,
            name: firstName,
            surname: surname,
            email: email,
            picture: picture,
            password: password,
        });
        await this.logger.logInfo(`New user created with email: ${email}`);
        return newUser;
    }
}