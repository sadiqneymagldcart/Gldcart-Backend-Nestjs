import * as express from "express";
import {
    controller,
    httpDelete,
    httpGet,
    httpPost,
    httpPut,
} from "inversify-express-utils";
import { Types } from "mongoose";
import { inject } from "inversify";
import { AddressService } from "../../services/user_info/address.service";
import { requireAuth } from "../../middlewares/auth.middleware";

@controller("/address")
export class AddressController {
    private readonly addressService: AddressService;

    public constructor(
        @inject(AddressService) addressService: AddressService,
    ) {
        this.addressService = addressService;
    }

    @httpPost("/")
    public async addAddressHandler(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        const { userId, addressData } = req.body;

        if (!Types.ObjectId.isValid(userId)) {
            return next(new Error("Invalid userId"));
        }
        try {
            await this.addressService.addAddress(userId, addressData);
            res.status(200).json({ message: "Address was added successfully." });
        } catch (error) {
            next(error);
        }
    }

    @httpPut("/")
    public async updateAddressHandler(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        const { userId, addressData, addressId } = req.body;

        if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(addressId)) {
            return next(new Error("Invalid userId or addressId"));
        }

        try {
            await this.addressService.updateAddress(userId, addressId, addressData);
            res.status(200).json({ message: "Address was updated successfully" });
        } catch (error) {
            next(error);
        }
    }

    @httpDelete("/")
    public async deleteAddressHandler(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        const { userId, addressId } = req.body;

        if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(addressId)) {
            return next(new Error("Invalid userId or addressId"));
        }

        try {
            await this.addressService.deleteAddress(userId, addressId);
            res.status(200).json({ message: "Address was deleted successfully" });
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/:id")
    public async getAddressesHandler(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        const id = req.params.id;

        if (!Types.ObjectId.isValid(id)) {
            return next(new Error("Invalid userId"));
        }

        try {
            const addresses = await this.addressService.getAddresses(id);
            res.status(200).json(addresses);
        } catch (error) {
            next(error);
        }
    }
}
