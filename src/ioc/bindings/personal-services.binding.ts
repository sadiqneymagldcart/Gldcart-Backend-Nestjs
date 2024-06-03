import { ProfileService } from "@services/personal/profile.service";
import { PasswordService } from "@services/personal/reset-password.service";
import { Container } from "inversify";

function bindUserInfoServices(container: Container) {
    container.bind(PasswordService).toSelf();
    container.bind(ProfileService).toSelf();
}

export { bindUserInfoServices };
