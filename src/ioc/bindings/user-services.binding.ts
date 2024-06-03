import { UserService } from "@services/user/user.service";
import { Container } from "inversify";

function bindUserServices(container: Container) {
    container.bind(UserService).toSelf();
}

export { bindUserServices };

