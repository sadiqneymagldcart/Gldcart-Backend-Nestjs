import {
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthenticationGuard } from '@shared/guards/jwt.auth.guard';
import { SubscriptionService } from '@subscription/services/subscription.service';

@ApiBearerAuth()
@ApiTags('Subscriptions')
@UseGuards(JwtAuthenticationGuard)
@Controller('subscriptions')
export class SubscriptionController {
  public constructor(
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Post('monthly')
  @ApiOperation({ summary: 'Create a monthly subscription' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The monthly subscription has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  public async createMonthlySubscription(
    @Req() request: Request & { user: { stripeCustomerId: string } },
  ) {
    return this.subscriptionService.createMonthlySubscription(
      request.user.stripeCustomerId,
    );
  }

  @Get('monthly')
  @ApiOperation({ summary: 'Get a monthly subscription' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The monthly subscription has been successfully retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  public async getMonthlySubscription(
    @Req() request: Request & { user: { stripeCustomerId: string } },
  ) {
    return this.subscriptionService.getMonthlySubscription(
      request.user.stripeCustomerId,
    );
  }
}
