import { Controller } from '@nestjs/common';
import { AddressService } from './address.service';

@Controller('address')
export class AddressController {
  public constructor(private readonly addressService: AddressService) {}
}
