import { Injectable, Logger, NotImplementedException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import path from 'path';
import { ContactEmailDto } from '@email/dto/contact.email.dto';
import { IEmailService } from '@email/interfaces/mail.service.interface';

@Injectable()
export class EmailService implements IEmailService {
  private readonly logger = new Logger(EmailService.name);

  public constructor(private readonly mailerService: MailerService) { }

  public async sendContactFormEmail(
    email_data: ContactEmailDto,
  ): Promise<void> {
    const templatePath = path.join(__dirname, '../templates/contact.hbs');

    await this.mailerService.sendMail({
      to: 'konotop401@gmail.com',
      subject: 'New Contact Form Submission',
      template: templatePath,
      context: {
        name: email_data.name,
        email: email_data.email,
        number: email_data.phone_number,
        message: email_data.message,
      },
    });
  }

  public async sendOrderConfirmationEmail(email_data: any) {
    this.logger.log('Sending order confirmation email');
    throw new NotImplementedException();
  }
}
