import { ContactEmailDto } from "@email/dto/contact.email.dto";

export interface IEmailService {
  /**
   * @description Send email
   */
  sendContactFormEmail(emailData: ContactEmailDto): Promise<void>;
}
