import {
    BaseHttpController,
    controller,
    httpPost,
} from "inversify-express-utils";
import { OTPService } from "../../services/auth/otp.service";
import { inject } from "inversify";

@controller("/otp")
export class OtpController extends BaseHttpController {
    private readonly otpService: OTPService;

    public constructor(@inject(OTPService) otpService: OTPService) {
        super();
        this.otpService = otpService;
    }
}
