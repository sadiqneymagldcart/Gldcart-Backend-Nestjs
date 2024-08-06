import { HealthService } from '@health/services/health.service';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  public constructor(private readonly healthService: HealthService) { }

  @Get('block-loop')
  public async blockEventLoop() {
    while (true) {
      console.log('Hi there');
    }
  }
}
