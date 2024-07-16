import { ContactEmailDto } from '@email/dto/contact.email.dto';

export interface IEmailService {
  /**
   * @description Send email
   */
  sendContactFormEmail(email_data: ContactEmailDto): Promise<void>;
}
