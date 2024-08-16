import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import path from 'path';
import { ContactEmailDto } from '@email/dto/contact.email.dto';
import { IEmailService } from '@email/interfaces/mail.service.interface';

@Injectable()
export class EmailService implements IEmailService {
  private readonly logger = new Logger(EmailService.name);

  public constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  public async sendContactFormEmail(
    emailData: ContactEmailDto,
  ): Promise<{ message: string }> {
    const templatePath = path.join(__dirname, '../templates/contact.hbs');

    await this.mailerService.sendMail({
      to: this.configService.get<string>('FEEDBACK_EMAIL'),
      subject: 'New Contact Form Submission',
      template: templatePath,
      context: {
        name: emailData.name,
        email: emailData.email,
        number: emailData.phone_number,
        message: emailData.message,
      },
    });

    return { message: 'Email sent successfully' };
  }

  public async sendOrderConfirmationEmail(emailData: any) {
    this.logger.log(
      `Sending order confirmation email to ${emailData.email}...`,
    );
  }
}
