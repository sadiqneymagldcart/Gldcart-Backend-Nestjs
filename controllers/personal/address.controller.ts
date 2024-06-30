import * as express from "express";
import {
    BaseHttpController,
    controller,
    httpDelete,
    httpGet,
    httpPost,
    httpPut,
} from "inversify-express-utils";
import { inject } from "inversify";
import { AddressService } from "@services/personal/address.service";
import { AuthenticationMiddleware } from "@middlewares/authentication.middleware";

@controller("/address", AuthenticationMiddleware)
export class AddressController extends BaseHttpController {
    private readonly addressService: AddressService;

    public constructor(@inject(AddressService) addressService: AddressService) {
        super();
        this.addressService = addressService;
    }

    @httpPost("/:userId")
    public async addAddress(
        request: express.Request,
    ): Promise<void> {
        const userId = request.params.userId;
        const addressData = request.body;

        await this.addressService.addAddress(userId, addressData);
        this.ok({ message: "Address was added successfully." });
    }

    @httpPut("/:userId/:addressId")
    public async updateAddress(
        request: express.Request,
    ): Promise<void> {
        const userId = request.params.userId;
        const addressId = request.params.addressId;
        const addressData = request.body;

        await this.addressService.updateAddress(userId, addressId, addressData);
        this.ok({ message: "Address was updated successfully" });
    }

    @httpDelete("/:userId/:addressId")
    public async deleteAddress(
        request: express.Request,
    ): Promise<void> {
        const userId = request.params.userId;
        const addressId = request.params.addressId;

        await this.addressService.deleteAddress(userId, addressId);
        this.ok({ message: "Address was deleted successfully" });
    }

    @httpGet("/:userId")
    public async getAddresses(
        request: express.Request,
    ): Promise<void> {
        const userId = request.params.userId;

        const addresses = await this.addressService.getAddresses(userId);
        this.ok(addresses);
    }
}

