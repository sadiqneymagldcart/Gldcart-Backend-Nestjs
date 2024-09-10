import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VerificationService {
  private twilioClient: Twilio;

  public constructor(private readonly configService: ConfigService) {
    this.twilioClient = new Twilio(
      this.configService.get<string>('TWILIO_ACCOUNT_SID'),
      this.configService.get<string>('TWILIO_AUTH_TOKEN'),
    );
  }
}
