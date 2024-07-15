import { Injectable, Logger, NotImplementedException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ContactEmailDto } from '@email/dto/contact.email.dto';
import { IEmailService } from '@email/interfaces/mail.service.interface';
import path from 'path';

@Injectable()
export class EmailService implements IEmailService {
  private readonly logger = new Logger(EmailService.name);

  public constructor(private readonly mailerService: MailerService) {}

  public async sendContactFormEmail(emailData: ContactEmailDto): Promise<void> {
    const templatePath = path.join(__dirname, '../templates/contact.hbs');

    await this.mailerService.sendMail({
      to: 'konotop401@gmail.com',
      subject: 'New Contact Form Submission',
      template: templatePath,
      context: {
        name: emailData.name,
        email: emailData.email,
        number: emailData.phone_number,
        message: emailData.message,
      },
    });
  }

  public async sendOrderConfirmationEmail(emailData: any) {
    this.logger.log('Sending order confirmation email');
  }
}
