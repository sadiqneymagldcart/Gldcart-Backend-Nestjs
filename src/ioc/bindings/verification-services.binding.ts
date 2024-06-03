import { VerificationService } from "@services/verification/verification.service";
import { Container } from "inversify";

function bindVerificationServices(container: Container) {
    container.bind(VerificationService).toSelf();
}

export { bindVerificationServices };

