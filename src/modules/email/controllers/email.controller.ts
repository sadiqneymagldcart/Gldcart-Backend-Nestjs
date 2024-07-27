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
import { ContactEmailDto } from '@email/dto/contact.email.dto';
import { EmailService } from '@email/services/email.service';

@ApiTags('Emails')
@Controller('/emails')
export class EmailController {
  private readonly logger = new Logger(EmailController.name);

  public constructor(private readonly emailService: EmailService) { }

  @Post('/contact-us')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send a contact form submission email' })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  @ApiBody({ type: ContactEmailDto, description: 'Contact form data' })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request: Invalid input data',
  })
  @ApiInternalServerErrorResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  public async sendContactFormEmail(
    @Body() email_data: ContactEmailDto,
  ): Promise<{ message: string }> {
    this.logger.log(
      `Received a new contact form submission from ${email_data.email}`,
    );
    await this.emailService.sendContactFormEmail(email_data);
    return { message: 'Email sent successfully' };
  }
}
