import { ContactEmailDto } from '@email/dto/contact.email.dto';
import { EmailService } from '@email/services/email.service';
import {
  Controller,
  Post,
  Body,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Emails')
@Controller('/emails')
export class EmailController {
  private readonly emailService: EmailService;
  private readonly logger: Logger;

  public constructor(emailService: EmailService) {
    this.emailService = emailService;
    this.logger = new Logger(EmailController.name);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/contact-us')
  @ApiOperation({ summary: 'Send a contact form submission email' })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  @ApiBody({ type: ContactEmailDto, description: 'Contact form data' })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request: Invalid input data',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  public async sendContactFormEmail(
    @Body() emailData: ContactEmailDto,
  ): Promise<{ message: string }> {
    this.logger.log(
      `Received a new contact form submission from ${emailData.email}`,
    );
    await this.emailService.sendContactFormEmail(emailData);
    return { message: 'Email sent successfully' };
  }
}
