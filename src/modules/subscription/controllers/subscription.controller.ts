import { Controller, Post, Req, UseGuards, Get } from '@nestjs/common';
import { JwtAuthenticationGuard } from '@shared/guards/jwt.auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SubscriptionService } from '@subscription/services/subscription.service';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  public constructor(
    private readonly subscriptionService: SubscriptionService,
  ) { }

  @Post('monthly')
  @UseGuards(JwtAuthenticationGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a monthly subscription' })
  @ApiResponse({
    status: 201,
    description: 'The monthly subscription has been successfully created.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  public async createMonthlySubscription(
    @Req() request: Request & { user: { stripeCustomerId: string } },
  ) {
    return this.subscriptionService.createMonthlySubscription(
      request.user.stripeCustomerId,
    );
  }

  @Get('monthly')
  @UseGuards(JwtAuthenticationGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a monthly subscription' })
  @ApiResponse({
    status: 200,
    description: 'The monthly subscription has been successfully retrieved.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  public async getMonthlySubscription(
    @Req() request: Request & { user: { stripeCustomerId: string } },
  ) {
    return this.subscriptionService.getMonthlySubscription(
      request.user.stripeCustomerId,
    );
  }
}
