import { AddressService } from "@address/services/address.service";
import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Address')
@Controller('address')
export class AddressController {
  public constructor(private readonly addressService: AddressService) {}
}
