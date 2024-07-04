import { AddressService } from '@address/services/address.service';
import { Controller } from '@nestjs/common';

@Controller('address')
export class AddressController {
  public constructor(private readonly addressService: AddressService) {}
}
