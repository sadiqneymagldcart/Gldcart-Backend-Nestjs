import { IUser } from "../models/user/User";

export class UserDto {
    id: string;
    type: string;
    name: string;
    surname: string;
    email: string;

    constructor(user: IUser) {
        this.id = user._id;
        this.type = user.type;
        this.name = user.name;
        this.surname = user.surname;
        this.email = user.email;
    }

}

