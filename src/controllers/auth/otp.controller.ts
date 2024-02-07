import { controller } from "inversify-express-utils";
import { OTPService } from "../../services/auth/otp.service";
import { inject } from "inversify";

@controller("/otp")
export class OtpController {
    private readonly otpService: OTPService;

    public constructor(@inject(OTPService) otpService: OTPService) { }

    // send otp
    // verify otp
}
