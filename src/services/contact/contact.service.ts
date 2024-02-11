import { injectable } from "inversify";
import { BaseService } from "../base.service";
import { MailService } from "../mail/mail.service";

@injectable()
export class ContactService extends BaseService {
}
