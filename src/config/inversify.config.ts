import {Container} from "inversify";
import {Logger} from "../utils/logger";
import {JwtService} from "../services/token/jwt.service";
import {TokenService} from "../services/token/token.service";
import {AuthService} from "../services/auth/auth.service";
import {GoogleAuthService} from "../services/auth/google.auth.service";

import "../controllers/auth/auth.controller";
import "../controllers/contact/contact.controller";

const container = new Container();

container.bind(Logger).toSelf();
container.bind(JwtService).toSelf();
container.bind(TokenService).toSelf();
container.bind(AuthService).toSelf();
container.bind(GoogleAuthService).toSelf();

export {container};
