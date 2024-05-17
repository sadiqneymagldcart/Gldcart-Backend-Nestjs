import * as express from "express";
import {
    controller,
    httpDelete,
    httpGet,
    httpPost,
    httpPut,
} from "inversify-express-utils";
import { inject } from "inversify";
import { AddressService } from "@services/personal/address.service";

@controller("/address")
export class AddressController {
    private readonly _addressService: AddressService;

    public constructor(@inject(AddressService) addressService: AddressService) {
        this._addressService = addressService;
    }

    @httpPost("/:userId")
    public async addAddress(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        const userId = req.params.userId;
        const addressData = req.body;

        try {
            await this._addressService.addAddress(userId, addressData);
            res.status(200).json({ message: "Address was added successfully." });
        } catch (error) {
            next(error);
        }
    }

    @httpPut("/:userId/:addressId")
    public async updateAddress(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        const userId = req.params.userId;
        const addressId = req.params.addressId;
        const addressData = req.body;

        try {
            await this._addressService.updateAddress(userId, addressId, addressData);
            res.status(200).json({ message: "Address was updated successfully" });
        } catch (error) {
            next(error);
        }
    }

    @httpDelete("/:userId/:addressId")
    public async deleteAddress(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        const userId = req.params.userId;
        const addressId = req.params.addressId;

        try {
            await this._addressService.deleteAddress(userId, addressId);
            res.status(200).json({ message: "Address was deleted successfully" });
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/:userId")
    public async getAddresses(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        const userId = req.params.userId;

        try {
            const addresses = await this._addressService.getAddresses(userId);
            res.status(200).json(addresses);
        } catch (error) {
            next(error);
        }
    }
}
