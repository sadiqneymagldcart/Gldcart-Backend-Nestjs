import {User} from "../models/user/User";

export class UserDto {
    id: string;
    type: string;
    name: string;
    surname: string;
    email: string;

    public constructor(user: User) {
        this.id = user._id;
        this.type = user.type;
        this.name = user.name;
        this.surname = user.surname;
        this.email = user.email;
    }

}

