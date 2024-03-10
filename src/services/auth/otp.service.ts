import { inject, injectable } from "inversify";
import { Logger } from "../../utils/logger";
import { BaseService } from "../base/base.service";

@injectable()
export class OTPService extends BaseService {
    public constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }

    async sendOTP(phone: string): Promise<any> {
        const otp = Math.floor(1000 + Math.random() * 9000);
        const message = `Your OTP code is ${otp}`;
        // send message
        return { otp };
    }

    async verifyOTP(phone: string, otp: number): Promise<boolean> {
        // verify otp
        return true;
    }
}
