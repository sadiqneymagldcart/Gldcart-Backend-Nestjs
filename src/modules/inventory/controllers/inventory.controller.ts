import { InventoryService } from '@inventory/services/inventory.service';
import { Controller } from '@nestjs/common';

@Controller('inventory')
export class InventoryController {
  public constructor(private readonly inventoryService: InventoryService) {}
}
