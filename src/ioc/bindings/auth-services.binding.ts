import { AuthService } from "@services/auth/auth.service";
import { GoogleAuthService } from "@services/auth/google-auth.service";
import { TokenService } from "@services/token/token.service";
import { Container } from "inversify";

function bindAuthServices(container: Container) {
    container.bind(TokenService).toSelf();
    container.bind(AuthService).toSelf();
    container.bind(GoogleAuthService).toSelf();
}

export { bindAuthServices };

