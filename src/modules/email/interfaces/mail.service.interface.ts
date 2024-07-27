import { ContactEmailDto } from '@email/dto/contact.email.dto';

export interface IEmailService {
  sendContactFormEmail(email_data: ContactEmailDto): Promise<void>;
}
