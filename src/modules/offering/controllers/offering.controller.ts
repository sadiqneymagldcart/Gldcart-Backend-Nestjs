import { Controller, Logger } from '@nestjs/common';
import { OfferingService } from '../services/offering.service';
import { SerializeWith } from '@shared/decorators/serialize.decorator';
import { Offering } from '../schemas/offering.schema';

@Controller('offering')
@SerializeWith(Offering)
export class OfferingController {
  private readonly offeringService: OfferingService;
  private readonly logger: Logger = new Logger(OfferingController.name);
  public constructor(offeringService: OfferingService) {
    this.offeringService = offeringService;
  }
}
